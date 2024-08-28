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
	isIRiver,
	isIRoute,
	isIState,
	parseMapFile,
	isIWildCulture,
	isINoReligion,
	getMapMetadata,
	isICulture,
	isIProvince,
	isIReligion,
} from "../map";
import type { IMapMetadata, IMap } from "../definitions";
import { parseCSV } from "./example/utils";

describe("map parsing", () => {
	describe("type guards", () => {
		test("isICulture()", () => {
			expect(isIWildCulture(examples.cultures[0])).toStrictEqual(true);
			const culturesListExample: unknown[] = examples.cultures.slice(1);
			for (const cultureExample of culturesListExample) {
				expect(isICulture(cultureExample)).toStrictEqual(true);
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
		test("isIProvince()", () => {
			const provincesListExample: unknown[] = examples.provinces;
			for (const provinceExample of provincesListExample) {
				expect(isIProvince(provinceExample)).toStrictEqual(true);
			}
		});
		test("isIReligion()", () => {
			expect(isINoReligion(examples.religions[0])).toStrictEqual(true);
			const religionsListExample: unknown[] = examples.religions.slice(1);
			for (const religionExample of religionsListExample) {
				expect(isIReligion(religionExample)).toStrictEqual(true);
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
			id: 1724705983305,
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
		const exampleMap: IMap = {
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
			expect(parsedMap).toEqual(exampleMap);
		});
	});
});
