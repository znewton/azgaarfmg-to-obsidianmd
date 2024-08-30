import fs from "node:fs/promises";
import type {
	IBiome,
	IBurg,
	ICulture,
	IJsonMap,
	IJsonMapEx,
	IWildCulture,
} from "./definitions";
import {
	buildBiomes,
	computeAreaFromPixels,
	computePopulation,
	getBiomeById,
	getCellById,
	getCultureById,
	getProvinceById,
	getReligionById,
	getStateById,
} from "./map";
import { isValidCulture, isValidJsonMap } from "./validation";
import {
	buildCityGeneratorLink,
	buildEmblemLink,
	buildVillageGeneratorLink,
	createMapObjectMarkdown,
	CustomContentRegexp,
	readableArea,
	readableHeight,
	readablePopulation,
	readableTemperature,
	vaultLinkToMd,
	type IMarkdownNote,
} from "./markdown";
import {
	createVaultDirectories,
	getFileNameForBurg,
	getFileNameForCulture,
	getLinkToBiome,
	getLinkToCulture,
	getLinkToProvince,
	getLinkToReligion,
	getLinkToState,
	type IPath,
	type IVaultDirectory,
} from "./vault";
import path from "node:path";

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
		...writeMapObjectToFile<IWildCulture & Partial<ICulture>>(
			map.pack.cultures,
			cultureToMd,
			vault.cultures,
			map,
			vault,
		),
		// Burgs
		...writeMapObjectToFile<IBurg>(
			map.pack.burgs.slice(1),
			burgToMd,
			vault.burgs,
			map,
			vault,
		),
	);

	await Promise.allSettled(fileWritePs);
}

export function cultureToMd(
	culture: IWildCulture & Partial<ICulture>,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const nameParts = culture.name.match(/(.*) \((.*)\)/);
	const species =
		isValidCulture(culture) && nameParts?.length ? nameParts[2] : "Any";
	const type = isValidCulture(culture) ? culture.type : "Any";
	const fileName = getFileNameForCulture(culture);
	const populationNumbers = computePopulation(
		culture.rural,
		culture.urban,
		map,
	);
	const populationStrings = readablePopulation(
		culture.rural,
		culture.urban,
		map,
	);
	const origins = culture.origins
		.filter((o) => typeof o === "number")
		.map((cultureId) => getCultureById(cultureId, map))
		.filter((c) => c !== undefined);
	// TODO: Link to name base file for random tables
	const nameBase =
		map.nameBases.find((base, i) => i === culture.base)?.name ?? "Any";
	const contents = createMapObjectMarkdown({
		aliases: [culture.name],
		type: "culture",
		additionalFrontMatter: {
			names: nameBase,
			type: type,
			species: species,
			area: computeAreaFromPixels(culture.area, map),
			totalPopulation: populationNumbers.total,
			urbanPopulation: populationNumbers.urban,
			ruralPopulation: populationNumbers.rural,
		},
		title: culture.name,
		propertiesList: {
			Names: nameBase,
			Type: type,
			Area: readableArea(culture.area, map),
			Population: `${populationStrings.total} (${populationStrings.urban} Urban, ${populationStrings.rural} Rural)`,
			Origins: origins
				.map((originCulture) =>
					vaultLinkToMd(getLinkToCulture(originCulture, vault)),
				)
				.join(", "),
		},
	});
	return {
		fileName,
		contents,
	};
}

export function burgToMd(
	burg: IBurg,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForBurg(burg);
	const population = computePopulation(0, burg.population, map).total;
	const isCity = population > map.settings.options.villageMaxPopulation;
	const villageOrCity = isCity ? "city" : "village";
	const burgCell = getCellById(burg.cell, map);
	if (!burgCell) {
		throw new Error(
			`Could not find Cell (${burg.cell}) for Burg (${burg.i} - ${burg.name})`,
		);
	}
	const mapLink = isCity
		? buildCityGeneratorLink(burg, map)
		: buildVillageGeneratorLink(burg, map);
	const mapEmbed = `<iframe src="${mapLink}" width="100%"></iframe><br/><a href="${mapLink}">View Map</a>`;
	const emblemUrl = buildEmblemLink(burg.coa);
	const emblemEmbed = `![floatright](${emblemUrl})`;

	const contents = createMapObjectMarkdown({
		tags: [villageOrCity],
		type: "burg",
		additionalFrontMatter: {
			population,
			type: burg.type,
		},
		beforeTitle: `${mapEmbed}\n\n${emblemEmbed}`,
		title: `${burg.name}${burg.capital ? '<span title="Capital City">&Star;</span>' : ""}`,
		propertiesList: {
			Population: readablePopulation(0, population, map).total,
			Temperature: readableTemperature(burgCell.grid.temp, map),
			Biome: vaultLinkToMd(
				getLinkToBiome(getBiomeById(burgCell.pack.biome, map), vault),
			),
			Culture: vaultLinkToMd(
				getLinkToCulture(getCultureById(burg.culture, map), vault),
			),
			State: vaultLinkToMd(
				getLinkToState(getStateById(burg.state, map), vault),
			),
			Religion: vaultLinkToMd(
				getLinkToReligion(getReligionById(burgCell.pack.religion, map), vault),
			),
			Province: vaultLinkToMd(
				getLinkToProvince(getProvinceById(burgCell.pack.province, map), vault),
			),
			Elevation: readableHeight(burgCell.pack, burgCell.grid, map),
		},
	});
	return { fileName, contents };
}
