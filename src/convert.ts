import fs from "node:fs/promises";
import { parseMapFile } from "./map";
import type { IMap } from "./definitions";

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
	const parsedMap: IMap = parseMapFile(mapFile);
	console.log("Stats: ", {
		cultures: parsedMap.cultures.length,
		burgs: parsedMap.burgs.length,
		states: parsedMap.states.length,
		regiments: parsedMap.regiments.length,
		provinces: parsedMap.provinces.length,
		religions: parsedMap.religions.length,
		rivers: parsedMap.rivers.length,
		markers: parsedMap.markers.length,
		routes: parsedMap.routes.length,
		notes: parsedMap.notes.length,
	});
}
