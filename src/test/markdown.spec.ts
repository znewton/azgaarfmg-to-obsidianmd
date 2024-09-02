import { beforeAll, describe, expect, test } from "@jest/globals";
import {
	buildCityGeneratorLink,
	buildEmblemLink,
	buildVillageGeneratorLink,
	readableArea,
	readableNumber,
	readablePopulation,
} from "../markdown";
import type { IJsonMap, IJsonMapEx, IMapSettings } from "../definitions";
import { buildBiomes, buildRouteLinks } from "../map";
import koberzarJson from "./example/koberzar.json";

describe("markdown helpers & converters", () => {
	const exampleMap: IJsonMapEx = {
		...(koberzarJson as unknown as IJsonMap),
		biomes: buildBiomes(koberzarJson as unknown as IJsonMap),
		routeLinks: buildRouteLinks(koberzarJson as unknown as IJsonMap),
	};
	describe("readableNumber()", () => {
		test("displays less than 1 thousand", () => {
			expect(readableNumber(440)).toBe("440");
			expect(readableNumber(123)).toBe("123");
			expect(readableNumber(285)).toBe("285");
			expect(readableNumber(75)).toBe("75");
			expect(readableNumber(10)).toBe("10");
			expect(readableNumber(6)).toBe("6");
		});
		test("displays thousands", () => {
			expect(readableNumber(440041)).toBe("440K");
			expect(readableNumber(440075)).toBe("440K");
			expect(readableNumber(440075)).toBe("440K");
			expect(readableNumber(1523)).toBe("1.52K");
			expect(readableNumber(1526)).toBe("1.53K");
		});
		test("displays millions", () => {
			expect(readableNumber(1234567)).toBe("1.23M");
			expect(readableNumber(1235567)).toBe("1.24M");
			expect(readableNumber(12345678)).toBe("12.3M");
			expect(readableNumber(123456789)).toBe("123M");
			expect(readableNumber(123556789)).toBe("124M");
		});
		test("displays billions", () => {
			expect(readableNumber(1234567890)).toBe("1.23B");
			expect(readableNumber(1235567890)).toBe("1.24B");
			expect(readableNumber(12345678900)).toBe("12.3B");
			expect(readableNumber(123456789000)).toBe("123B");
			expect(readableNumber(123556789000)).toBe("124B");
		});
	});
	describe("readableArea()", () => {
		test("displays scaled pixels as square miles", () => {
			const mockSettings: Partial<IMapSettings> = {
				distanceScale: 4,
				distanceUnit: "mi",
				areaUnit: "square",
			};
			expect(readableArea(1, { settings: mockSettings } as IJsonMap)).toBe(
				"16 mi<sup>2</sup>",
			);
		});
		test("displays scaled pixels as square kilometers", () => {
			const mockSettings: Partial<IMapSettings> = {
				distanceScale: 10,
				distanceUnit: "km",
				areaUnit: "square",
			};
			expect(readableArea(1, { settings: mockSettings } as IJsonMap)).toBe(
				"100 km<sup>2</sup>",
			);
		});
	});
	describe("readablePopulation()", () => {
		test("scales by population rate", () => {
			const mockSettings: Partial<IMapSettings> = {
				populationRate: 1000,
			};
			expect(
				readablePopulation(1, 2, { settings: mockSettings } as IJsonMap),
			).toStrictEqual({
				total: "3K",
				urban: "2K",
				rural: "1K",
			});
		});
	});
	describe("link builders", () => {
		const exampleCity = exampleMap.pack.burgs[1];
		const exampleVillage = exampleMap.pack.burgs[8];
		const compareUrls = (actual: string, expected: string): void => {
			const actualUrl = new URL(actual);
			const expectedUrl = new URL(expected);
			expect(actualUrl.toJSON()).toStrictEqual(expectedUrl.toJSON());
		};
		beforeAll(() => {
			// Specific test info is based on these specific burgs, so need to
			// make sure they are correct. Otherwise results will be misleading.
			expect(exampleCity.i).toStrictEqual(1);
			expect(exampleCity.name).toStrictEqual("Timber");
			expect(exampleVillage.i).toStrictEqual(8);
			expect(exampleVillage.name).toStrictEqual("Ylaleki");
		});
		test("buildEmblemLink()", () => {
			compareUrls(
				buildEmblemLink(exampleVillage.coa),
				"https://armoria.herokuapp.com/?size=150&format=svg&coa=%7B%22t1%22:%22sable%22,%22division%22:%7B%22division%22:%22perCross%22,%22t%22:%22argent%22,%22line%22:%22straight%22%7D,%22charges%22:%5B%7B%22charge%22:%22fusil%22,%22t%22:%22or%22,%22p%22:%22e%22,%22size%22:1.5%7D%5D,%22shield%22:%22round%22%7D",
			);
			compareUrls(
				buildEmblemLink(exampleCity.coa),
				"https://armoria.herokuapp.com/?size=150&format=svg&coa=%7B%22t1%22:%22purpure%22,%22charges%22:%5B%7B%22charge%22:%22ramHeadErased%22,%22t%22:%22argent%22,%22p%22:%22jln%22,%22t2%22:%22argent%22,%22t3%22:%22argent%22,%22size%22:0.7%7D%5D,%22shield%22:%22roman%22%7D",
			);
		});
		test("buildVillageGeneratorLink()", () => {
			compareUrls(
				buildVillageGeneratorLink(exampleVillage, exampleMap),
				"https://watabou.github.io/village-generator/?pop=1562&name=Ylaleki&seed=5163292510008&width=1600&height=727&tags=highway%2Cdense",
			);
		});
		test("buildCityGeneratorLink()", () => {
			compareUrls(
				buildCityGeneratorLink(exampleCity, exampleMap),
				"https://watabou.github.io/city-generator/?name=Timber&population=17368&size=38&seed=5163292510001&river=1&coast=0&farms=1&citadel=1&urban_castle=0&hub=true&plaza=1&temple=0&walls=1&shantytown=0&gates=-1",
			);
		});
	});
});
