import fs from "node:fs/promises";
import { parseMapFile } from "./map";
import type { IRawMap } from "./definitions";

export async function convertMapToObsidianVault(
	mapFilePath: string,
	obsidianVaultPath: string,
): Promise<void> {
	if ((await fs.stat(mapFilePath)).isFile() === false) {
		throw new Error("Provided Map File was not a File.");
	}
	if ((await fs.stat(obsidianVaultPath)).isDirectory() === false) {
		// TODO: Create if not exists
		throw new Error("Provided Obsidian Vault Path was not a Directory.");
	}
	const mapFile = await fs.readFile(mapFilePath, { encoding: "utf-8" });
	const parsedMap: IRawMap = parseMapFile(mapFile);

	console.log(parsedMap);
}
