import fs from "node:fs/promises";
import path from "node:path";
import type { IBurg, ICulture, IMap, IMapMetadata } from "./definitions";

/**
 * Make a directory at the given path, as well as any necessary parent directories.
 * Does not throw if directory already exists.
 *
 * @param path - Directory Path
 */
const mkdirSafe = async (path: string) => fs.mkdir(path, { recursive: true });

export interface IPath {
	/**
	 * Absolute path.
	 * Use for reading/writing files in the script.
	 */
	absolute: string;
	/**
	 * Relative path from the root directory of the vault.
	 * Use for creating markdown links.
	 */
	relative: string;
}

/**
 * Vault Structure based on https://obsidianttrpgtutorials.com/Obsidian+TTRPG+Tutorials/Getting+Started/Vault+Structure
 *
 * /1. World - Notes about the world
 *  /Cultures - Types of People
 *  /Burgs - Villages and Cities
 *  /Provinces - Large areas within States
 *  /States - Governments (e.g. Monarchies, Theocracies, Empires)
 *      /<StateName>
 *          /Military - Military Regiments for the State
 *  /Religions - Major belief systems
 *  /Rivers - Each river and information about it
 *  /Routes - Major routes, roads, and trails
 *  /POI - Points of Interest
 *
 * This structure creates a baseline for a world that can be added to with flavor and mechanics for a given story or system.
 */
export interface IVaultDirectory {
	root: IPath;
	world: IPath;
	cultures: IPath;
	burgs: IPath;
	provinces: IPath;
	states: IPath;
	religions: IPath;
	rivers: IPath;
	routes: IPath;
	poi: IPath;
}
/**
 * Create the initial directory structure for the vault.
 *
 * @param rootDir - Absolute path to the root directory for the vault
 */
export async function createVaultDirectories(
	rootDir: string,
): Promise<IVaultDirectory> {
	if (!path.isAbsolute(rootDir)) {
		throw new Error(`Root directory must be absolute path: ${rootDir}`);
	}
	const createSubDirPath = (
		subDirName: string,
		parentAbsolute: string,
		rootAbsolute: string = rootDir,
	): IPath => {
		const absolutePath = path.resolve(parentAbsolute, subDirName);
		const relativePath = path.relative(rootAbsolute, absolutePath);
		return { absolute: absolutePath, relative: relativePath };
	};
	const worldDirectoryName = "1. World";
	const worldDirectoryPath = createSubDirPath(
		worldDirectoryName,
		rootDir,
		rootDir,
	);

	const vaultDirectory: IVaultDirectory = {
		root: { absolute: rootDir, relative: path.relative(rootDir, rootDir) },
		world: worldDirectoryPath,
		cultures: createSubDirPath("Cultures", worldDirectoryPath.absolute),
		burgs: createSubDirPath("Burgs", worldDirectoryPath.absolute),
		provinces: createSubDirPath("Provinces", worldDirectoryPath.absolute),
		states: createSubDirPath("States", worldDirectoryPath.absolute),
		religions: createSubDirPath("Religions", worldDirectoryPath.absolute),
		rivers: createSubDirPath("Rivers", worldDirectoryPath.absolute),
		routes: createSubDirPath("Routes", worldDirectoryPath.absolute),
		poi: createSubDirPath("POI", worldDirectoryPath.absolute),
	};
	await mkdirSafe(vaultDirectory.root.absolute);
	await mkdirSafe(vaultDirectory.world.absolute);
	await Promise.all([
		mkdirSafe(vaultDirectory.cultures.absolute),
		mkdirSafe(vaultDirectory.burgs.absolute),
		mkdirSafe(vaultDirectory.provinces.absolute),
		mkdirSafe(vaultDirectory.states.absolute),
		mkdirSafe(vaultDirectory.religions.absolute),
		mkdirSafe(vaultDirectory.rivers.absolute),
		mkdirSafe(vaultDirectory.routes.absolute),
		mkdirSafe(vaultDirectory.poi.absolute),
	]);
	return vaultDirectory;
}

function propertyListToMd(props: Record<string, string | undefined>): string {
	return Object.entries(props)
		.filter(([key, value]) => !!value)
		.map(([key, value]) => `- **${key}**: ${value}`)
		.join("\n");
}

/**
 * Outputs number as a smaller, more readable string.
 * Examples:
 * - 440045 -> 440K
 * - 53075 -> 53.1K
 * - 1234567 -> 1.23M
 */
export function readableNumber(num: number): string {
	return Intl.NumberFormat("en", {
		notation: "compact",
		compactDisplay: "short",
		maximumSignificantDigits: 3,
	}).format(num);
}

function computeAreaFromPixels(
	areaInPixels: number,
	mapMetadata: IMapMetadata,
): number {
	return areaInPixels * (mapMetadata.distanceScale * mapMetadata.distanceScale);
}

export function readableArea(
	areaInPixels: number,
	mapMetadata: IMapMetadata,
): string {
	const areaInMapUnits = computeAreaFromPixels(areaInPixels, mapMetadata);
	const getUnitStr = () => {
		if (mapMetadata.areaUnit === "square") {
			return `${mapMetadata.distanceUnit}<sup>2</sup>`;
		}
		throw new Error(`Unrecognized Area Unit: ${mapMetadata.areaUnit}`);
	};
	return `${readableNumber(areaInMapUnits)} ${getUnitStr()}`;
}

function computePopulation(
	ruralPopulationPoints: number,
	urbanPopulationPoints: number,
	mapMetadata: IMapMetadata,
): { total: number; rural: number; urban: number } {
	return {
		total:
			(ruralPopulationPoints + urbanPopulationPoints) *
			mapMetadata.populationRate,
		urban: urbanPopulationPoints * mapMetadata.populationRate,
		rural: ruralPopulationPoints * mapMetadata.populationRate,
	};
}

export function readablePopulation(
	ruralPopulationPoints: number,
	urbanPopulationPoints: number,
	mapMetadata: IMapMetadata,
): { total: string; rural: string; urban: string } {
	const computed = computePopulation(
		ruralPopulationPoints,
		urbanPopulationPoints,
		mapMetadata,
	);
	return {
		total: readableNumber(computed.total),
		urban: readableNumber(computed.urban),
		rural: readableNumber(computed.rural),
	};
}

export interface IMarkdownNote {
	fileName: string;
	contents: string;
}

/**
 * Example:
 * ```md
 * ---
 * alias: Khazadur (Dwarf)
 * tags:
 * - culture
 * ---
 *
 * # Khazadur (Dwarf)
 * - **Names:** Dwarven
 * - **Type:** Nomadic
 * - **Area**: 2.4K mi<sup>2</sup>
 * - **Population:** 692M
 *
 * @param culture
 * @param map
 * @param vault
 * @returns
 */
export function cultureToMd(
	culture: ICulture,
	map: IMap,
	vault: IVaultDirectory,
): IMarkdownNote {
	const nameParts = culture.name.match(/(.*) \((.*)\)/);
	if (!nameParts) {
		throw new Error(`Unexpected Culture Name: ${culture.name}`);
	}
	const name = nameParts[1];
	const species = nameParts[2];
	const fileName = name;
	const populationNumbers = computePopulation(
		culture.rural,
		culture.urban,
		map.metadata,
	);
	const populationStrings = readablePopulation(
		culture.rural,
		culture.urban,
		map.metadata,
	);
	// TODO: Link to name base file for random tables
	const nameBase =
		map.nameBases.find((base) => base.i === culture.base)?.name ?? "Any";
	const contents = `---
alias: "${culture.name}"
tags:
- culture
names: ${nameBase}
type: ${culture.type}
species: ${species}
area: ${computeAreaFromPixels(culture.area, map.metadata)}
totalPopulation: ${populationNumbers.total}
urbanPopulation: ${populationNumbers.urban}
ruralPopulation: ${populationNumbers.rural}
---

# ${culture.name}

${propertyListToMd({
	Names: nameBase,
	Type: culture.type,
	Area: readableArea(culture.area, map.metadata),
	Population: `${populationStrings.total} (${populationStrings.urban} Urban, ${populationStrings.rural} Rural)`,
})}
`;
	return {
		fileName,
		contents,
	};
}

export function burgToMd(
	burg: IBurg,
	map: IMap,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = burg.name;
	const population = burg.population * map.metadata.populationRate;
	const villageOrCity =
		population > map.metadata.villageMaxPopulation ? "city" : "village";
	const contents = `---
tags:
- burg
- ${villageOrCity}
population: ${population}
---

![floatright]()

# ${burg.name}



`;
	return { fileName, contents };
}
