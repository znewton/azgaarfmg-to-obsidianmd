import { describe, expect, test } from "@jest/globals";
import { readableArea, readableNumber, readablePopulation } from "../markdown";
import type { IJsonMap, IMapSettings } from "../definitions";

describe("markdown helpers & converters", () => {
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
});
