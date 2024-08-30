import { stringify as toYAML } from "yaml";
import type {
	IBiome,
	IBurg,
	IGridCell,
	IJsonMap,
	IJsonMapEx,
	IPackCell,
} from "./definitions";
import {
	cellIsCrossroad,
	computeAreaFromPixels,
	computePopulation,
	getBiomeById,
	getCellById,
	getFeatureById,
} from "./map";
import type { IVaultLink } from "./vault";
import { each, minmax, round, normalize } from "./utils";

/**
 * Regex for finding the custom content section of a note, and isolating the custom content within if it exists.
 */
export const CustomContentRegexp = /%% CUSTOM-START %%\n(.+)\n%% CUSTOM-END %%/;
/**
 * Custom Content special section start/end string to be inserted in every markdown note.
 */
export const CustomContentString = "%% CUSTOM-START %%\n%% CUSTOM-END %%";

export function propertyListToMd(
	props: Record<string, string | undefined>,
): string {
	return Object.entries(props)
		.filter(([key, value]) => !!value)
		.map(([key, value]) => `- **${key}**: ${value}`)
		.join("\n");
}

export function vaultLinkToMd(
	link: IVaultLink | undefined,
	escapePipe = false,
): string | undefined {
	if (link === undefined) {
		return undefined;
	}
	return `[[${link.relativeVaultPath}${escapePipe ? "\\" : ""}|${link.displayName}]]`;
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

export function readableArea(areaInPixels: number, map: IJsonMap): string {
	const areaInMapUnits = computeAreaFromPixels(areaInPixels, map);
	const getUnitStr = () => {
		if (map.settings.areaUnit === "square") {
			return `${map.settings.distanceUnit}<sup>2</sup>`;
		}
		throw new Error(`Unrecognized Area Unit: ${map.settings.areaUnit}`);
	};
	return `${readableNumber(areaInMapUnits)} ${getUnitStr()}`;
}

export function readablePopulation(
	ruralPopulationPoints: number,
	urbanPopulationPoints: number,
	map: IJsonMap,
): { total: string; rural: string; urban: string } {
	const computed = computePopulation(
		ruralPopulationPoints,
		urbanPopulationPoints,
		map,
	);
	return {
		total: readableNumber(computed.total),
		urban: readableNumber(computed.urban),
		rural: readableNumber(computed.rural),
	};
}

function convertCelsiusToFahrenheit(tempInCelsius: number): number {
	return Math.round(tempInCelsius * 2 + 30);
}
export function readableTemperature(tempC: number, map: IJsonMap): string {
	const temp = map.settings.temperatureScale.endsWith("F")
		? convertCelsiusToFahrenheit(tempC)
		: tempC;
	return `${temp}${map.settings.temperatureScale}`;
}

export function readableHeight(
	packCell: IPackCell,
	gridCell: IGridCell,
	map: IJsonMap,
): string {
	const cellHeight = packCell.h < 20 ? gridCell.h : packCell.h;
	const unitRatio =
		map.settings.heightUnit === "ft" // ft
			? 3.281
			: map.settings.heightUnit === "m" // meters
				? 1
				: map.settings.heightUnit === "f" // fathoms
					? 0.5468
					: -1;
	if (unitRatio < 0) {
		throw new Error(`Invalid height unit: ${map.settings.heightUnit}`);
	}

	const height =
		cellHeight >= 20
			? (cellHeight - 18) ** +map.settings.heightExponent
			: cellHeight > 0
				? ((cellHeight - 20) / cellHeight) * 50
				: -990;

	return `${height} ${map.settings.heightUnit}`;
}

function createRemovedCallout(objectType: string): string {
	return `> [!missing]- Removed\n> This ${objectType} was removed from the map.`;
}

function createMarkdownFootNotes(
	footNotes: Record<string | number, string> | undefined,
): string | undefined {
	if (footNotes === undefined || Object.entries(footNotes).length === 0) {
		return undefined;
	}
	return Object.entries(footNotes)
		.map(([key, value]) => `[^${key}]: ${value}`)
		.join("\n");
}

const addOptionalMarkdownLine = (line: string | undefined): string =>
	line !== undefined || line === "" ? `\n${line}\n` : "";

export function createMapObjectMarkdown(opts: {
	aliases?: string[];
	type: string;
	tags?: string[];
	title: string;
	propertiesList: Record<string, string | undefined>;
	beforeTitle?: string;
	beforePropertiesList?: string;
	beforeCustomContent?: string;
	afterCustomContent?: string;
	// biome-ignore lint:suspicious/noExplicitAny
	additionalFrontMatter?: Record<string, any>;
	footNotes?: Record<string | number, string>;
	removed?: boolean;
}): string {
	// biome-ignore lint:suspicious/noExplicitAny
	const frontMatter: Record<string, any> = {
		aliases: opts.aliases,
		tags: [opts.type, ...(opts.tags ?? [])],
		...opts.additionalFrontMatter,
	};
	for (const [key, value] of Object.entries(frontMatter)) {
		if (value === undefined) {
			delete frontMatter[key];
		}
	}
	const removedCallout =
		opts.removed === true ? createRemovedCallout(opts.type) : undefined;
	return `---
${toYAML(frontMatter)}
---
${addOptionalMarkdownLine(removedCallout)}${addOptionalMarkdownLine(opts.beforeTitle)}
# ${opts.title}
${addOptionalMarkdownLine(opts.beforePropertiesList)}${addOptionalMarkdownLine(propertyListToMd(opts.propertiesList))}${addOptionalMarkdownLine(opts.beforeCustomContent)}
${CustomContentString}
${addOptionalMarkdownLine(opts.afterCustomContent)}
${addOptionalMarkdownLine(createMarkdownFootNotes(opts.footNotes))}`;
}

export interface IMarkdownNote {
	fileName: string;
	contents: string;
}

/**
 * Default settings for Emblem images.
 */
export const EmblemSettings = {
	/**
	 * Image output format for the emblem (e.g. png, svg).
	 */
	format: "svg",
	/**
	 * Image size in pixels for the emblem.
	 * Determines height/width.
	 */
	size: 150,
};
/**
 * Builds a link to an emblem image from Armoria.
 * Can be linked as an embedded markdown image.
 */
export function buildEmblemLink(coatOfArms: object): string {
	const url = new URL("https://armoria.herokuapp.com");
	url.searchParams.append("size", `${EmblemSettings.size}`);
	url.searchParams.append("format", `${EmblemSettings.format}`);
	url.searchParams.append("coa", JSON.stringify(coatOfArms));
	// The API doesn't accept encoded colons and commas
	return url.toString().replaceAll("%3A", ":").replaceAll("%2C", ",");
}
/**
 * Builds generator seed for burg.
 */
function buildBurgSeed(burg: IBurg, map: IJsonMap): string {
	if (burg.MFCG !== undefined) {
		return burg.MFCG.toString();
	}
	return `${map.info.seed}${burg.i.toString().padStart(4, "0")}`;
}
/**
 * Whether a Burg has farms depends on
 * whether a Biome can be considered Arable.
 *
 */
function burgHasFarms(hasRiver: 0 | 1, biome: IBiome) {
	if (hasRiver) {
		// Easier to farm when there is a river nearby.
		return [1, 2, 3, 4, 5, 6, 7, 8].includes(biome.i);
	}
	return [5, 6, 7, 8].includes(biome.i);
}
/**
 * Build a link to Watabou's city generator for burgs with populations above the village threshold.
 * Reference: https://github.com/Azgaar/Fantasy-Map-Generator/blob/e77202a08a725a5eb4c414eefdf5bc8f6b8b30e0/modules/ui/editors.js#L328
 */
export function buildCityGeneratorLink(burg: IBurg, map: IJsonMapEx): string {
	const url = new URL("https://watabou.github.io/city-generator/");

	const population = round(computePopulation(0, burg.population, map).total);
	const burgCell = getCellById(burg.cell, map);
	if (!burgCell) {
		throw new Error(
			`Could not find corresponding Cell (${burg.cell}) for Burg (${burg.i} - ${burg.name})`,
		);
	}
	const sizeRaw =
		2.13 *
		((burg.population * map.settings.populationRate) /
			map.settings.urbanDensity) **
			0.385;
	const size = minmax(Math.ceil(sizeRaw), 6, 100);
	const burgBiome = getBiomeById(burgCell.pack.biome, map);
	if (!burgBiome) {
		throw new Error(
			`Could not find corresponding Biome (${burgCell.pack.biome}) for Burg (${burg.i} - ${burg.name}) in Cell (${burg.cell})`,
		);
	}

	const river = burgCell?.pack?.r === 0 ? 0 : 1;
	const coast = Number(burg.port > 0);
	/**
	 * Calculates what direction from town the Sea should be facing if relevant.
	 */
	const getSea = () => {
		if (!coast || !burgCell?.pack.haven) return undefined;
		const havenCell = map.pack.cells.find((c) => c.i === burgCell.pack.haven);
		if (!havenCell) return undefined;

		// calculate sea direction: 0 = south, 0.5 = west, 1 = north, 1.5 = east
		const burgCellP = burgCell.pack.p;
		const havenCellP = havenCell.p;
		let deg =
			(Math.atan2(havenCellP[1] - burgCellP[1], havenCellP[0] - burgCellP[0]) *
				180) /
				Math.PI -
			90;
		if (deg < 0) deg += 360;
		return round(normalize(deg, 0, 360) * 2, 2);
	};
	const sea = getSea();
	const farms = +burgHasFarms(river, burgBiome);

	const citadel = +burg.citadel;
	const urban_castle = +(citadel && each(2)(burg.i));

	const hub = cellIsCrossroad(burgCell.pack, map);
	const walls = +burg.walls;
	const plaza = +burg.plaza;
	const temple = +burg.temple;
	const shantytown = +burg.shanty;

	const params: Record<string, string | number | boolean | undefined> = {
		name: burg.name,
		population: population.toString(),
		size,
		seed: buildBurgSeed(burg, map),
		river,
		coast,
		farms,
		citadel,
		urban_castle,
		hub,
		plaza,
		temple,
		walls,
		shantytown,
		gates: -1,
		sea,
	};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		url.searchParams.append(key, value.toString());
	}
	return url.toString();
}

/**
 * Build a link to Watabou's village generator for burgs with populations below the village threshold.
 * Reference: https://github.com/Azgaar/Fantasy-Map-Generator/blob/e77202a08a725a5eb4c414eefdf5bc8f6b8b30e0/modules/ui/editors.js#L385
 */
export function buildVillageGeneratorLink(
	burg: IBurg,
	map: IJsonMapEx,
): string {
	const url = new URL("https://watabou.github.io/village-generator/");
	const pop = round(computePopulation(0, burg.population, map).total);

	const burgCell = getCellById(burg.cell, map);
	if (!burgCell) {
		throw new Error(
			`Could not find corresponding Cell (${burg.cell}) for Burg (${burg.i} - ${burg.name})`,
		);
	}
	const burgBiome = getBiomeById(burgCell.pack.biome, map);
	if (!burgBiome) {
		throw new Error(
			`Could not find corresponding Biome (${burgCell.pack.biome}) for Burg (${burg.i} - ${burg.name}) in Cell (${burg.cell})`,
		);
	}
	const burgFeature = getFeatureById(burgCell.pack.f, map);
	if (!burgFeature) {
		throw new Error(
			`Could not find corresponding Feature (${burgCell.pack.f}) for Burg (${burg.i} - ${burg.name}) in Cell (${burg.cell})`,
		);
	}

	const tags: string[] = [];
	if (burgCell.pack.r && burgCell.pack.haven) tags.push("estuary");
	else if (burgCell.pack.haven && burgFeature.cells === 1)
		tags.push("island,district");
	else if (burg.port) tags.push("coast");
	else if (burgCell.pack.conf) tags.push("confluence");
	else if (burgCell.pack.r) tags.push("river");
	else if (pop < 200 && each(4)(burg.cell)) tags.push("pond");

	const connections = map.routeLinks[burg.cell] || {};
	const roads = Object.values(connections).filter((routeId) => {
		const route = map.pack.routes[routeId];
		return route.group === "roads" || route.group === "trails";
	}).length;
	tags.push(roads > 1 ? "highway" : roads === 1 ? "dead end" : "isolated");

	const river = burgCell?.pack?.r === 0 ? 0 : 1;
	if (!burgHasFarms(river, burgBiome)) tags.push("uncultivated");
	else if (each(6)(burg.cell)) tags.push("farmland");

	const temp = burgCell.grid.temp;
	if (temp <= 0 || temp > 28 || (temp > 25 && each(3)(burg.cell)))
		tags.push("no orchards");

	if (!burg.plaza) tags.push("no square");

	if (pop < 100) tags.push("sparse");
	else if (pop > 300) tags.push("dense");

	const width = (() => {
		if (pop > 1500) return 1600;
		if (pop > 1000) return 1400;
		if (pop > 500) return 1000;
		if (pop > 200) return 800;
		if (pop > 100) return 600;
		return 400;
	})();
	const height = round(width / 2.2);

	const params: Record<
		string,
		string | number | boolean | string[] | undefined
	> = {
		pop,
		name: burg.name,
		seed: buildBurgSeed(burg, map),
		width,
		height,
		tags,
	};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		url.searchParams.append(key, value.toString());
	}
	return url.toString();
}
