import { describe, expect, test } from "@jest/globals";
import path from "node:path";
import fs from "node:fs";
import examples from "./example/examples.json";
import {
	isIBiome,
	isIBurg,
	isIMarker,
	isINameBase,
	isINote,
	isIRawProvince,
	isIRawCulture,
	isIRawReligion,
	isIRiver,
	isIRoute,
	isIState,
	parseMapFile,
	isIWildCulture,
	isINoReligion,
	getMapMetadata,
	computeFullMapFromRawMap,
} from "../map";
import type { IMapMetadata, IRawMap, IRegiment } from "../definitions";
import { parseCSV } from "./example/utils";

describe("map parsing", () => {
	describe("type guards", () => {
		test("isIRawCulture()", () => {
			expect(isIWildCulture(examples.cultures[0])).toStrictEqual(true);
			const culturesListExample: unknown[] = examples.cultures.slice(1);
			for (const cultureExample of culturesListExample) {
				expect(isIRawCulture(cultureExample)).toStrictEqual(true);
			}
		});
		test("isIBurg()", () => {
			const burgsListExample: unknown[] = examples.burgs;
			for (const burgExample of burgsListExample) {
				expect(isIBurg(burgExample)).toStrictEqual(true);
			}
		});
		test("isIState()", () => {
			const statesListExample: unknown[] = examples.states;
			for (const stateExample of statesListExample) {
				expect(isIState(stateExample)).toStrictEqual(true);
			}
		});
		test("isIRawProvince()", () => {
			const provincesListExample: unknown[] = examples.provinces;
			for (const provinceExample of provincesListExample) {
				expect(isIRawProvince(provinceExample)).toStrictEqual(true);
			}
		});
		test("isIRawReligion()", () => {
			expect(isINoReligion(examples.religions[0])).toStrictEqual(true);
			const religionsListExample: unknown[] = examples.religions.slice(1);
			for (const religionExample of religionsListExample) {
				expect(isIRawReligion(religionExample)).toStrictEqual(true);
			}
		});
		test("isIRiver()", () => {
			const riversListExample: unknown[] = examples.rivers;
			for (const riverExample of riversListExample) {
				expect(isIRiver(riverExample)).toStrictEqual(true);
			}
		});
		test("isIMarker()", () => {
			const markersListExample: unknown[] = examples.markers;
			for (const markerExample of markersListExample) {
				expect(isIMarker(markerExample)).toStrictEqual(true);
			}
		});
		test("isIRoute()", () => {
			const routesListExample: unknown[] = examples.routes;
			for (const routeExample of routesListExample) {
				expect(isIRoute(routeExample)).toStrictEqual(true);
			}
		});
		test.skip("isIBiome()", () => {
			// TODO: Biomes not present in .map
			const biomesListExample: unknown[] = [];
			for (const biomeExample of biomesListExample) {
				expect(isIBiome(biomeExample)).toStrictEqual(true);
			}
		});
		test("isINote()", () => {
			const notesListExample: unknown[] = examples.notes;
			for (const noteExample of notesListExample) {
				expect(isINote(noteExample)).toStrictEqual(true);
			}
		});
		test.skip("isINameBase()", () => {
			// TODO: NameBases not present in .map
			const nameBasesListExample: unknown[] = [];
			for (const ameBaseExample of nameBasesListExample) {
				expect(isINameBase(ameBaseExample)).toStrictEqual(true);
			}
		});
	});

	describe("parsing functions", () => {
		const exampleMetadata: IMapMetadata = {
			version: "1.99.12",
			tip: "File can be loaded in azgaar.github.io/Fantasy-Map-Generator",
			createdTimestamp: new Date("2024-8-27").getTime(),
			seed: 516329251,
			width: 1710,
			height: 983,
			id: 1723940448793,
			distanceUnit: "mi",
			distanceScale: 4,
			areaUnit: "square",
			heightUnit: "ft",
			temperatureUnit: "°F",
			worldName: "Koberzar",
			totalLatitude: 59.4,
			totalLongitude: 103.3,
			latitudeNorth: 59.9,
			latitudeSouth: 0.5,
			longitudeWest: -51.6,
			longitudeEast: 51.7,
			biomes: [
				"Marine",
				"Hot desert",
				"Cold desert",
				"Savanna",
				"Grassland",
				"Tropical seasonal forest",
				"Temperate deciduous forest",
				"Tropical rainforest",
				"Temperate rainforest",
				"Taiga",
				"Tundra",
				"Glacier",
				"Wetland",
			],
		};
		const exampleRawMap: IRawMap = {
			metadata: exampleMetadata,
			cultures: examples.cultures,
			burgs: examples.burgs,
			states: examples.states,
			regiments: [],
			provinces: examples.provinces,
			religions: examples.religions,
			rivers: examples.rivers,
			markers: examples.markers,
			routes: examples.routes,
			biomes: [],
			notes: examples.notes,
			nameBases: [],
		};
		test("getMapMetadata()", () => {
			const exampleMapFilePath = path.resolve(
				"./src/test/example/koberzar.map",
			);
			const exampleMapFile = fs.readFileSync(exampleMapFilePath, {
				encoding: "utf-8",
			});
			const parsedMetadata = getMapMetadata(exampleMapFile);
			expect(parsedMetadata).toStrictEqual(exampleMetadata);
		});

		test("parseMapFile()", () => {
			const exampleMapFilePath = path.resolve(
				"./src/test/example/koberzar.map",
			);
			const exampleMapFile = fs.readFileSync(exampleMapFilePath, {
				encoding: "utf-8",
			});
			// TODO: Regiments are added a bit differently. Not sure if they
			// actually need to be in the top level Map.
			// for (const { military } of examples.states) {
			// 	if (!military) continue;
			// 	expectedMap.regiments.push(military as unknown as IRegiment);
			// }
			const parsedMap = parseMapFile(exampleMapFile);
			expect(parsedMap).toEqual(exampleRawMap);
		});

		test.skip("computeFullMapFromRawMap()", () => {
			const computedMap = computeFullMapFromRawMap(exampleRawMap);

			// Cultures
			const exampleCulturesCsvFilePath = path.resolve(
				"./src/test/example/cultures.csv",
			);
			const exampleCulturesCsvFile = fs.readFileSync(
				exampleCulturesCsvFilePath,
				{ encoding: "utf-8" },
			);
			const exampleCulturesCsvFileParsed = parseCSV(exampleCulturesCsvFile);
			for (const culture of computedMap.cultures) {
				const exampleCulture = exampleCulturesCsvFileParsed.find(
					({ Id }) => Id === culture.i,
				);
				expect(exampleCulture).not.toBeUndefined();
				// for typing sake
				if (exampleCulture === undefined) continue;
				expect(culture.cells).toStrictEqual(exampleCulture.Cells);
				expect(culture.area).toStrictEqual(exampleCulture["Area mi2"]);
				expect((culture.urban ?? 0) + (culture.rural ?? 0)).toStrictEqual(
					exampleCulture.Population,
				);
			}

			// Provinces
			const exampleProvincesCsvFilePath = path.resolve(
				"./src/test/example/provinces.csv",
			);
			const exampleProvincesCsvFile = fs.readFileSync(
				exampleProvincesCsvFilePath,
				{ encoding: "utf-8" },
			);
			const exampleProvincesCsvFileParsed = parseCSV(exampleProvincesCsvFile);
			for (const province of computedMap.provinces) {
				const exampleProvince = exampleProvincesCsvFileParsed.find(
					({ Id }) => Id === province.i,
				);
				expect(exampleProvince).not.toBeUndefined();
				// for typing sake
				if (exampleProvince === undefined) continue;
				expect(province.area).toStrictEqual(exampleProvince["Area mi2"]);
				expect((province.urban ?? 0) + (province.rural ?? 0)).toStrictEqual(
					exampleProvince["Total Population"],
				);
				expect(province.rural).toStrictEqual(
					exampleProvince["Rural Population"],
				);
				expect(province.urban).toStrictEqual(
					exampleProvince["Urban Population"],
				);
			}

			// Religions
			const exampleReligionsCsvFilePath = path.resolve(
				"./src/test/example/religions.csv",
			);
			const exampleReligionsCsvFile = fs.readFileSync(
				exampleReligionsCsvFilePath,
				{ encoding: "utf-8" },
			);
			const exampleReligionsCsvFileParsed = parseCSV(exampleReligionsCsvFile);
			for (const religion of computedMap.religions) {
				const exampleReligion = exampleReligionsCsvFileParsed.find(
					({ Id }) => Id === religion,
				);
				expect(exampleReligion).not.toBeUndefined();
				// for typing sake
				if (exampleReligion === undefined) continue;
			}
		});
	});
});
