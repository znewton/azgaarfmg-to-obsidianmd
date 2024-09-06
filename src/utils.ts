import fs from "node:fs/promises";
import { CustomContentRegexp } from "./markdown";

/**
 * Round v to decimal places d
 * @param v - Number to round
 * @param d - decimal places
 */
export const round = (v: number, d = 0) => {
	const m = 10 ** d;
	return Math.round(v * m) / m;
};
export const minmax = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);
export const normalize = (val: number, min: number, max: number) =>
	minmax((val - min) / (max - min), 0, 1);
/**
 * Iterating over a list of indices i, 1 of every n will return true.
 */
export const each = (n: number) => (i: number) => i % n === 0;

/**
 * Retrieves any Custom Content from the file at the given path
 * if it exists.
 */
export async function getExistingFileCustomContents(
	filePath: string,
): Promise<string | undefined> {
	const existingFile = await fs
		.readFile(filePath, { encoding: "utf-8" })
		.catch((e: unknown) => {
			if (
				typeof e === "object" &&
				(e as Record<string, string>).code === "ENOENT"
			) {
				return undefined;
			}
			throw e;
		});
	const customContent = existingFile?.match(CustomContentRegexp)?.[1];
	return customContent;
}

/**
 * Inserts the custom contents into the content string within the special location.
 */
export function insertCustomContents(
	customContents: string | undefined,
	contents: string,
): string {
	if (customContents === undefined) {
		return contents;
	}
	const [start, end] = contents.split(CustomContentRegexp);
	return `${start}%% CUSTOM-START %%\n${customContents}\n%% CUSTOM-END %%${end}`;
}
