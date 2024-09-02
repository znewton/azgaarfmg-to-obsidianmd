import fs from "node:fs/promises";
import path from "node:path";
import type {
	IBiome,
	IBurg,
	ICulture,
	IMarker,
	INameBase,
	INeutralState,
	INoReligion,
	INote,
	IProvince,
	IReligion,
	IRiver,
	IRoute,
	IState,
	IWildCulture,
} from "./definitions";

/**
 * Make a directory at the given path, as well as any necessary parent directories.
 * Does not throw if directory already exists.
 *
 * @param path - Directory Path
 */
const mkdirSafe = async (path: string) => fs.mkdir(path, { recursive: true });

/**
 * Vault directory where all of the generated content will be stored.
 */
export const worldDirectoryName = "1. World";
/**
 * Vault directory where all of the asset files will be stored.
 */
export const assetsDirectoryName = "z_Assets";
/**
 * Vault directory where all of the map data files will be stored.
 */
export const mapDataDirectoryName = "z_Map";

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
 * /z_Assets - Images and such
 * /z_Map - Geojson files and such
 *
 * This structure creates a baseline for a world that can be added to with flavor and mechanics for a given story or system.
 */
export interface IVaultDirectory {
	root: IPath;
	world: IPath;
	assets: IPath;
	mapData: IPath;
	cultures: IPath;
	biomes: IPath;
	burgs: IPath;
	nameBases: IPath;
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
	const worldDirectoryPath = createSubDirPath(
		worldDirectoryName,
		rootDir,
		rootDir,
	);
	const assetsDirectoryPath = createSubDirPath(
		assetsDirectoryName,
		rootDir,
		rootDir,
	);
	const mapDataDirectoryPath = createSubDirPath(
		mapDataDirectoryName,
		rootDir,
		rootDir,
	);

	const vaultDirectory: IVaultDirectory = {
		root: { absolute: rootDir, relative: path.relative(rootDir, rootDir) },
		world: worldDirectoryPath,
		assets: assetsDirectoryPath,
		mapData: mapDataDirectoryPath,
		cultures: createSubDirPath("Cultures", worldDirectoryPath.absolute),
		biomes: createSubDirPath("Biomes", worldDirectoryPath.absolute),
		burgs: createSubDirPath("Burgs", worldDirectoryPath.absolute),
		nameBases: createSubDirPath("NameBases", worldDirectoryPath.absolute),
		provinces: createSubDirPath("Provinces", worldDirectoryPath.absolute),
		states: createSubDirPath("States", worldDirectoryPath.absolute),
		religions: createSubDirPath("Religions", worldDirectoryPath.absolute),
		rivers: createSubDirPath("Rivers", worldDirectoryPath.absolute),
		routes: createSubDirPath("Routes", worldDirectoryPath.absolute),
		poi: createSubDirPath("PointsOfInterest", worldDirectoryPath.absolute),
	};
	await mkdirSafe(vaultDirectory.root.absolute);
	await mkdirSafe(vaultDirectory.world.absolute);
	await Promise.all([
		mkdirSafe(vaultDirectory.cultures.absolute),
		mkdirSafe(vaultDirectory.biomes.absolute),
		mkdirSafe(vaultDirectory.burgs.absolute),
		mkdirSafe(vaultDirectory.nameBases.absolute),
		mkdirSafe(vaultDirectory.provinces.absolute),
		mkdirSafe(vaultDirectory.states.absolute),
		mkdirSafe(vaultDirectory.religions.absolute),
		mkdirSafe(vaultDirectory.rivers.absolute),
		mkdirSafe(vaultDirectory.routes.absolute),
		mkdirSafe(vaultDirectory.poi.absolute),
	]);
	return vaultDirectory;
}

export interface IVaultLink {
	displayName: string;
	relativeVaultPath: string;
}

function normalizeFileName(fileName: string): string {
	return fileName.replace(/\(\)\/\<\>\:\\\|\?\*/g, "");
}

export function getFileNameForCulture(
	culture: ICulture | IWildCulture,
): string {
	return normalizeFileName(culture.name.split(" (")[0]);
}
export function getLinkToCulture(
	culture: ICulture | IWildCulture | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (culture === undefined) {
		return undefined;
	}
	return {
		displayName: culture.name,
		relativeVaultPath: path.join(
			vault.cultures.relative,
			getFileNameForCulture(culture),
		),
	};
}

export function getFileNameForBurg(burg: IBurg): string {
	return normalizeFileName(burg.name);
}
export function getLinkToBurg(
	burg: IBurg | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (burg === undefined) {
		return undefined;
	}
	return {
		displayName: burg.name,
		relativeVaultPath: path.join(
			vault.burgs.relative,
			getFileNameForBurg(burg),
		),
	};
}

export function getFileNameForProvince(province: IProvince): string {
	return normalizeFileName(province.name);
}
export function getLinkToProvince(
	province: IProvince | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (province === undefined) {
		return undefined;
	}
	return {
		displayName: province.fullName,
		relativeVaultPath: path.join(
			vault.provinces.relative,
			getFileNameForProvince(province),
		),
	};
}

export function getFileNameForState(state: IState | INeutralState): string {
	return normalizeFileName(state.name);
}
export function getLinkToState(
	state: IState | INeutralState | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (state === undefined) {
		return undefined;
	}
	return {
		displayName: (state as IState).fullName ?? state.name,
		relativeVaultPath: path.join(
			vault.states.relative,
			getFileNameForState(state),
		),
	};
}

export function getFileNameForReligion(
	religion: IReligion | INoReligion,
): string {
	return normalizeFileName(religion.name);
}
export function getLinkToReligion(
	religion: IReligion | INoReligion | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (religion === undefined) {
		return undefined;
	}
	return {
		displayName: religion.name,
		relativeVaultPath: path.join(
			vault.religions.relative,
			getFileNameForReligion(religion),
		),
	};
}

export function getFileNameForNameBase(nameBase: INameBase): string {
	return normalizeFileName(nameBase.name);
}
export function getLinkToNameBase(
	nameBase: INameBase | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (nameBase === undefined) {
		return undefined;
	}
	return {
		displayName: nameBase.name,
		relativeVaultPath: path.join(
			vault.nameBases.relative,
			getFileNameForNameBase(nameBase),
		),
	};
}

export function getFileNameForBiome(biome: IBiome): string {
	return normalizeFileName(biome.name);
}
export function getLinkToBiome(
	biome: IBiome | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (biome === undefined) {
		return undefined;
	}
	return {
		displayName: biome.name,
		relativeVaultPath: path.join(
			vault.biomes.relative,
			getFileNameForBiome(biome),
		),
	};
}

export function getFileNameForRiver(river: IRiver): string {
	return normalizeFileName(river.name);
}
export function getLinkToRiver(
	river: IRiver | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (river === undefined) {
		return undefined;
	}
	return {
		displayName: river.name,
		relativeVaultPath: path.join(
			vault.rivers.relative,
			getFileNameForRiver(river),
		),
	};
}

export function getFileNameForRoute(route: IRoute): string {
	return normalizeFileName(`${route.group}-${route.i}`);
}
export function getLinkToRoute(
	route: IRoute | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (route === undefined) {
		return undefined;
	}
	return {
		displayName: route.name ?? `${route.group.toLocaleUpperCase()} ${route.i}`,
		relativeVaultPath: path.join(
			vault.routes.relative,
			getFileNameForRoute(route),
		),
	};
}

export function getFileNameForMarker(
	marker: IMarker,
	note: INote | undefined,
): string {
	return normalizeFileName(note ? note.name : `marker-${marker.i}`);
}
export function getLinkToMarker(
	marker: IMarker | undefined,
	note: INote | undefined,
	vault: IVaultDirectory,
): IVaultLink | undefined {
	if (marker === undefined) {
		return undefined;
	}
	return {
		displayName: note ? note.name : `Unknown Marker ${marker.i}`,
		relativeVaultPath: path.join(
			vault.poi.relative,
			getFileNameForMarker(marker, note),
		),
	};
}
