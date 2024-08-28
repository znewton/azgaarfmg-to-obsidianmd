import { describe, expect, test } from "@jest/globals";
import koberzarJson from "./example/koberzar.json";
import {
	isValidCulture,
	isValidBurg,
	isValidState,
	isValidProvince,
	isValidReligion,
	isValidRiver,
	isValidMarker,
	isValidRoute,
	isValidBiomesData,
	isValidNote,
	isValidNameBase,
	isValidPackCell,
	isValidGridCell,
	isValidWildCulture,
	isValidNeutralState,
	isValidNoReligion,
	isValidJsonMap,
} from "../validation";

// File is too large for types to be parsed.
// biome-ignore lint:suspicious/noExplicitAny
const exampleJson = koberzarJson as any;

// TODO: These aren't great tests, because they only validate mostly
// truthy cases.
// This is OK for now because the point is just to warn users if their input is off.
describe("validation", () => {
	describe("map input validation", () => {
		test("isValidCulture()", () => {
			const examples: unknown[] = exampleJson.pack.cultures;
			expect(isValidWildCulture(examples[0])).toBeTruthy();
			expect(isValidCulture(examples[0])).toBeFalsy();
			for (const example of examples.slice(1)) {
				expect(isValidCulture(example)).toBeTruthy();
			}
		});
		test("isValidBurg()", () => {
			const examples: unknown[] = exampleJson.pack.burgs;
			expect(examples[0]).toStrictEqual({});
			expect(isValidBurg(examples[0])).toBeFalsy();
			for (const example of examples.slice(1)) {
				expect(isValidBurg(example)).toBeTruthy();
			}
		});
		test("isValidState()", () => {
			const examples: unknown[] = exampleJson.pack.states;
			expect(isValidNeutralState(examples[0])).toBeTruthy();
			expect(isValidState(examples[0])).toBeFalsy();
			for (const example of examples.slice(1)) {
				expect(isValidState(example)).toBeTruthy();
			}
		});
		test("isValidProvince()", () => {
			const examples: unknown[] = exampleJson.pack.provinces;
			expect(examples[0]).toStrictEqual(0);
			for (const example of examples.slice(1)) {
				expect(isValidProvince(example)).toBeTruthy();
			}
		});
		test("isValidReligion()", () => {
			const examples: unknown[] = exampleJson.pack.religions;
			expect(isValidNoReligion(examples[0])).toBeTruthy();
			expect(isValidReligion(examples[0])).toBeFalsy();
			for (const example of examples.slice(1)) {
				expect(isValidReligion(example)).toBeTruthy();
			}
		});
		test("isValidRiver()", () => {
			const examples: unknown[] = exampleJson.pack.rivers;
			for (const example of examples) {
				expect(isValidRiver(example)).toBeTruthy();
			}
		});
		test("isValidMarker()", () => {
			const examples: unknown[] = exampleJson.pack.markers;
			for (const example of examples) {
				expect(isValidMarker(example)).toBeTruthy();
			}
		});
		test("isValidRoute()", () => {
			const examples: unknown[] = exampleJson.pack.routes;
			for (const example of examples) {
				expect(isValidRoute(example)).toBeTruthy();
			}
		});
		test("isValidBiomesData()", () => {
			const example: unknown[] = exampleJson.biomesData;
			expect(isValidBiomesData(example)).toBeTruthy();
		});
		test("isValidNote()", () => {
			const examples: unknown[] = exampleJson.notes;
			for (const example of examples) {
				expect(isValidNote(example)).toBeTruthy();
			}
		});
		test("isValidNameBase()", () => {
			const examples: unknown[] = exampleJson.nameBases;
			for (const example of examples) {
				expect(isValidNameBase(example)).toBeTruthy();
			}
		});
		test("isValidPackCell()", () => {
			const examples: unknown[] = exampleJson.pack.cells;
			for (const example of examples) {
				expect(isValidPackCell(example)).toBeTruthy();
			}
		});
		test("isValidGridCell()", () => {
			const examples: unknown[] = exampleJson.grid.cells;
			for (const example of examples) {
				expect(isValidGridCell(example)).toBeTruthy();
			}
		});
		test("isValidJsonMap()", () => {
			expect(isValidJsonMap(exampleJson)).toBeTruthy();
		});
	});
});
