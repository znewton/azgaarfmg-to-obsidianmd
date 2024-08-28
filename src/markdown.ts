import fs from "node:fs/promises";
import path from "node:path";
import type { ICulture, IMap, IMapMetadata } from "./definitions";

/**
 * Make a directory at the given path, as well as any necessary parent directories.
 * Does not throw if directory already exists.
 *
 * @param path - Directory Path
 */
const mkdirSafe = async (path: string) => fs.mkdir(path, { recursive: true });

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
	root: string;
	world: string;
	cultures: string;
	burgs: string;
	provinces: string;
	states: string;
	religions: string;
	rivers: string;
	routes: string;
	poi: string;
}
/**
 * Create the initial directory structure for the vault.
 *
 * @param rootDir - Root directory for the vault
 */
export async function createVaultDirectories(
	rootDir: string,
): Promise<IVaultDirectory> {
	const worldDirectoryPath = path.join(rootDir, "1. World");
	const vaultDirectory: IVaultDirectory = {
		root: rootDir,
		world: worldDirectoryPath,
		cultures: path.join(worldDirectoryPath, "/Cultures"),
		burgs: path.join(worldDirectoryPath, "/Burgs"),
		provinces: path.join(worldDirectoryPath, "/Provinces"),
		states: path.join(worldDirectoryPath, "/States"),
		religions: path.join(worldDirectoryPath, "/Religions"),
		rivers: path.join(worldDirectoryPath, "/Rivers"),
		routes: path.join(worldDirectoryPath, "/Routes"),
		poi: path.join(worldDirectoryPath, "/POI"),
	};
	await mkdirSafe(vaultDirectory.root);
	await mkdirSafe(vaultDirectory.world);
	await Promise.all([
		mkdirSafe(vaultDirectory.cultures),
		mkdirSafe(vaultDirectory.burgs),
		mkdirSafe(vaultDirectory.provinces),
		mkdirSafe(vaultDirectory.states),
		mkdirSafe(vaultDirectory.religions),
		mkdirSafe(vaultDirectory.rivers),
		mkdirSafe(vaultDirectory.routes),
		mkdirSafe(vaultDirectory.poi),
	]);
	return vaultDirectory;
}

function propertyListToMd(props: Record<string, string | undefined>): string {
	return Object.entries(props)
		.filter(([key, value]) => !!value)
		.map(([key, value]) => `- **${key}**: ${value}`)
		.join("\n");
}

function readableArea(areaInPixels: number, mapMetadata: IMapMetadata): string {
	const areaInMapUnits =
		areaInPixels * (mapMetadata.distanceScale * mapMetadata.distanceScale);
	const getUnitStr = () => {
		if (mapMetadata.areaUnit === "square") {
			return `${mapMetadata.distanceUnit}<sup>2</sup>`;
		}
		throw new Error(`Unrecognized Area Unit: ${mapMetadata.areaUnit}`);
	};
	return `${areaInMapUnits} ${getUnitStr()}`;
}

function readablePopulation(
	ruralPopulationPoints: number,
	urbanPopulationPoints: number,
	mapMetadata: IMapMetadata,
): string {
	return "";
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
): { fileName: string; contents: string } {
	const nameParts = culture.name.match(/(.*) \((.*)\)/);
	if (!nameParts) {
		throw new Error(`Unexpected Culture Name: ${culture.name}`);
	}
	const name = nameParts[1];
	const species = nameParts[2];
	const fileName = name;
	const contents = `
---
alias: "${culture.name}"
tags:
- culture
species: ${species}
---

# ${culture.name}

${propertyListToMd({
	Names: map.nameBases.find((base) => base.i === culture.base)?.name,
	Type: culture.type,
	Area: readableArea(culture.area, map.metadata),
	Population: readablePopulation(culture.rural, culture.urban, map.metadata),
})}
`;
	return {
		fileName,
		contents,
	};
}
