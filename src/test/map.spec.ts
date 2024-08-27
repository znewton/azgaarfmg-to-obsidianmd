import { describe, expect, test } from "@jest/globals";
import path from "node:path";
import fs from "node:fs";
import examples from "./examples.json";
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
} from "../map";
import type { IRawMap, IRegiment } from "../definitions";

describe("map parsing", () => {
	describe("type guards", () => {
		test("isIRawCulture()", () => {
			const culturesListExample: unknown[] = examples.cultures;
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
			const religionsListExample: unknown[] = examples.religions;
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

	test("parseMapFile()", () => {
		const exampleMapFilePath = path.resolve("./src/test/koberzar.map");
		const exampleMapFile = fs.readFileSync(exampleMapFilePath, {
			encoding: "utf-8",
		});
		const expectedMap: IRawMap = {
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
		// TODO: Regiments are added a bit differently. Not sure if they
		// actually need to be in the top level Map.
		// for (const { military } of examples.states) {
		// 	if (!military) continue;
		// 	expectedMap.regiments.push(military as unknown as IRegiment);
		// }
		const parsedMap = parseMapFile(exampleMapFile);
		expect(parsedMap).toEqual(expectedMap);
	});
});
