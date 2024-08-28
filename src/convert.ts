import fs from "node:fs/promises";
import type { IBiome, IJsonMap, IJsonMapEx } from "./definitions";
import { buildBiomes } from "./mapJson";

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
	const mapJson = await fs.readFile(mapFilePath, { encoding: "utf-8" });
	const parsedMap: IJsonMap = JSON.parse(mapJson);
	const biomes: IBiome[] = buildBiomes(parsedMap);
	console.log("Stats: ", {
		cultures: parsedMap.pack.cultures.length,
		burgs: parsedMap.pack.burgs.length,
		states: parsedMap.pack.states.length,
		provinces: parsedMap.pack.provinces.length,
		religions: parsedMap.pack.religions.length,
		rivers: parsedMap.pack.rivers.length,
		markers: parsedMap.pack.markers.length,
		routes: parsedMap.pack.routes.length,
		notes: parsedMap.notes.length,
		biomes: biomes.length,
	});
	const map: IJsonMapEx = { ...parsedMap, biomes };
}
