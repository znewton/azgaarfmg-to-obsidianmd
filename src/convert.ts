import fs from "node:fs/promises";
import type { IBiome, ICulture, IJsonMap, IJsonMapEx } from "./definitions";
import { buildBiomes } from "./mapJson";
import { isValidJsonMap } from "./validation";
import {
	burgToMd,
	createVaultDirectories,
	cultureToMd,
	type IMarkdownNote,
	type IPath,
	type IVaultDirectory,
} from "./markdown";
import path from "node:path";

const CustomContentRegexp = /%% CUSTOM-START %%\n(.+)\n%% CUSTOM-END %%/;

/**
 * Retrieves any Custom Content from the file at the given path
 * if it exists.
 */
async function getExistingFileCustomContents(
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
function insertCustomContents(
	customContents: string | undefined,
	contents: string,
): string {
	if (customContents === undefined) {
		return contents;
	}
	const [start, end] = contents.split(CustomContentRegexp);
	return `${start}%% CUSTOM-START %%\n${customContents}\n%% CUSTOM-END %%${end}`;
}

function writeMapObjectToFile<T>(
	objects: T[],
	converter: (obj: T, map: IJsonMapEx, vault: IVaultDirectory) => IMarkdownNote,
	vaultPath: IPath,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): Promise<void>[] {
	const writePs: Promise<void>[] = [];
	const writeMarkdownNote = async (note: IMarkdownNote) => {
		const filePath = path.join(vaultPath.absolute, `${note.fileName}.md`);
		const existingCustomContents =
			await getExistingFileCustomContents(filePath);
		const backwardsCompatibleContents = insertCustomContents(
			existingCustomContents,
			note.contents,
		);
		await fs.writeFile(filePath, backwardsCompatibleContents);
	};
	for (const obj of objects) {
		const markdownNote = converter(obj, map, vault);
		writePs.push(writeMarkdownNote(markdownNote));
	}
	return writePs;
}

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
	const isValidMap = isValidJsonMap(parsedMap);
	if (!isValidMap) {
		throw new Error(
			"Invalid Map Detected! Script might not run properly. Exiting to avoid data contamination.",
		);
	}
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
	const vault: IVaultDirectory =
		await createVaultDirectories(obsidianVaultPath);
	const fileWritePs: Promise<void>[] = [];

	fileWritePs.push(
		// Cultures
		// ...writeMapObjectToFile(
		// 	[map.pack.cultures[0]],
		// 	wildCultureToMd,
		// 	vault.cultures,
		// 	map,
		// 	vault,
		// ),
		...writeMapObjectToFile<ICulture>(
			map.pack.cultures.slice(1) as ICulture[],
			cultureToMd,
			vault.cultures,
			map,
			vault,
		),
		// Burgs
		// ...writeMapObjectToFile(map.pack.burgs, burgToMd, vault.burgs, map, vault),
	);

	await Promise.allSettled(fileWritePs);
}
