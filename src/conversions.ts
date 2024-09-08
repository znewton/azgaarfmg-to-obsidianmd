import { stringify as toYAML } from "yaml";
import fs from "node:fs/promises";
import type {
	IBiome,
	IBurg,
	ICulture,
	IJsonMap,
	IJsonMapEx,
	IMarker,
	INameBase,
	INeutralState,
	INoReligion,
	INote,
	IPackCell,
	IProvince,
	IReligion,
	IRiver,
	IRoute,
	IState,
	IWildCulture,
} from "./definitions";
import {
	buildBiomes,
	buildRouteLinks,
	cellIsCrossroad,
	computeAreaFromPixels,
	computePopulation,
	getBiomeById,
	getBurgById,
	getCellById,
	getCultureById,
	getFeatureById,
	getLatLongFromXY,
	getMarkerById,
	getMarkerNote,
	getNameBaseById,
	getProvinceById,
	getReligionById,
	getRiverById,
	getStateById,
} from "./map";
import { isValidCulture, isValidJsonMap, isValidReligion } from "./validation";
import {
	buildCityGeneratorLink,
	buildEmblemLink,
	buildVillageGeneratorLink,
	createMapObjectMarkdown,
	CustomContentRegexp,
	CustomContentString,
	propertyListToMd,
	readableArea,
	readableHeight,
	readablePopulation,
	readableTemperature,
	vaultLinkToMd,
	type IMarkdownNote,
} from "./markdown";
import {
	createVaultDirectories,
	getFileNameForBiome,
	getFileNameForBurg,
	getFileNameForCulture,
	getFileNameForMarker,
	getFileNameForNameBase,
	getFileNameForProvince,
	getFileNameForReligion,
	getFileNameForRiver,
	getFileNameForRoute,
	getFileNameForState,
	getLinkToBiome,
	getLinkToBurg,
	getLinkToCulture,
	getLinkToProvince,
	getLinkToReligion,
	getLinkToRiver,
	getLinkToState,
	worldDirectoryName,
	type IVaultPath,
	type IVaultDirectory,
	getLinkToMarker,
	getLinkToNameBase,
	getLinkToRoute,
	getDisplayNameForRoute,
} from "./vault";
import path from "node:path";
import { getExistingFileCustomContents, insertCustomContents } from "./utils";
import { createDataviewPages } from "./dataviews";

function writeMapObjectToFile<T>(
	objects: T[],
	converter: (obj: T, map: IJsonMapEx, vault: IVaultDirectory) => IMarkdownNote,
	vaultPath: IVaultPath,
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
	jsonFilePath: string,
	mapFilePath: string,
	imagePath: string,
	obsidianVaultPath: string,
): Promise<void> {
	if ((await fs.stat(jsonFilePath)).isFile() === false) {
		throw new Error("Provided JSON File was not a File.");
	}
	if ((await fs.stat(mapFilePath)).isFile() === false) {
		throw new Error("Provided Map File was not a File.");
	}
	if ((await fs.stat(imagePath)).isFile() === false) {
		throw new Error("Provided Image File was not a File.");
	}
	if ((await fs.stat(obsidianVaultPath)).isDirectory() === false) {
		// TODO: Create if not exists
		throw new Error("Provided Obsidian Vault Path was not a Directory.");
	}
	const mapJson = await fs.readFile(jsonFilePath, { encoding: "utf-8" });
	const parsedMap: IJsonMap = JSON.parse(mapJson);
	const isValidMap = isValidJsonMap(parsedMap);
	if (!isValidMap) {
		throw new Error(
			"Invalid Map Detected! Script might not run properly. Exiting to avoid data contamination.",
		);
	}
	const biomes: IBiome[] = buildBiomes(parsedMap);
	const routeLinks = buildRouteLinks(parsedMap);
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
	const map: IJsonMapEx = { ...parsedMap, biomes, routeLinks };
	const vault: IVaultDirectory =
		await createVaultDirectories(obsidianVaultPath);
	const homePage = createMapHomepage(map, vault);
	const mdFileWritePs: Promise<void>[] = [];

	// Pre-compute cell->Marker links
	const cellIdToMarker = new Map<number, IMarker>();
	for (const marker of map.pack.markers) {
		cellIdToMarker.set(marker.cell, marker);
	}
	// Pre-compute cell->Routes links
	const cellIdToRoutes = new Map<number, Map<number, IRoute>>();
	for (const mapRoute of map.pack.routes) {
		for (const [, , cellId] of mapRoute.points) {
			const cell = getCellById(cellId, map);
			if (!cell) continue;
			if (!cellIdToRoutes.has(cellId)) {
				cellIdToRoutes.set(cellId, new Map());
			}
			cellIdToRoutes.get(cellId)?.set(mapRoute.i, mapRoute);
		}
	}

	mdFileWritePs.push(
		// Home Page
		fs.writeFile(
			path.join(vault.world.absolute, `${homePage.fileName}.md`),
			homePage.contents,
		),
		// Cultures
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
		// States
		...writeMapObjectToFile<INeutralState & Partial<IState>>(
			map.pack.states,
			stateToMd,
			vault.states,
			map,
			vault,
		),
		// Provinces
		...writeMapObjectToFile<IProvince>(
			map.pack.provinces.slice(1),
			provinceToMd,
			vault.provinces,
			map,
			vault,
		),
		// Religions
		...writeMapObjectToFile<INoReligion & Partial<IReligion>>(
			map.pack.religions,
			religionToMd,
			vault.religions,
			map,
			vault,
		),
		// Biomes
		...writeMapObjectToFile<IBiome>(
			map.biomes,
			biomeToMd,
			vault.biomes,
			map,
			vault,
		),
		// Markers
		...writeMapObjectToFile<IMarker>(
			map.pack.markers,
			markerToMd,
			vault.poi,
			map,
			vault,
		),
		// Rivers
		...writeMapObjectToFile<IRiver>(
			map.pack.rivers,
			riverToMd,
			vault.rivers,
			map,
			vault,
		),
		// Routes
		...writeMapObjectToFile<IRoute>(
			map.pack.routes,
			(obj: IRoute, map: IJsonMapEx, vault: IVaultDirectory) =>
				routeToMd(obj, cellIdToMarker, cellIdToRoutes, map, vault),
			vault.routes,
			map,
			vault,
		),
		// Name Bases
		...writeMapObjectToFile<INameBase>(
			map.nameBases,
			nameBaseToMd,
			vault.nameBases,
			map,
			vault,
		),
		createDataviewPages(vault),
	);

	const mdFileWriteResults = await Promise.allSettled(mdFileWritePs);

	for (const mdFileWriteResult of mdFileWriteResults) {
		if (mdFileWriteResult.status === "rejected") {
			console.warn(
				"Encountered error writing markdown files.",
				mdFileWriteResult.reason,
			);
		}
	}

	// Copy supporting files to appropriate directories
	const supportingFileCopyResults = await Promise.allSettled([
		fs.copyFile(
			jsonFilePath,
			path.resolve(
				vault.assets.absolute,
				`${map.info.mapName.toLowerCase()}.json`,
			),
		),
		fs.copyFile(
			mapFilePath,
			path.resolve(
				vault.assets.absolute,
				`${map.info.mapName.toLowerCase()}.map`,
			),
		),
		fs.copyFile(
			imagePath,
			path.resolve(
				vault.assets.absolute,
				`${map.info.mapName.toLowerCase()}.svg`,
			),
		),
	]);

	for (const supportingFileCopyResult of supportingFileCopyResults) {
		if (supportingFileCopyResult.status === "rejected") {
			console.warn(
				"Encountered error copying source files.",
				supportingFileCopyResult.reason,
			);
		}
	}
}

const ruralUrbanMixedPopulationString = (
	obj: { rural: number; urban: number },
	map: IJsonMap,
) => {
	const populationStrings = readablePopulation(obj.rural, obj.urban, map);
	return `${populationStrings.total} (${populationStrings.urban} Urban, ${populationStrings.rural} Rural)`;
};

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
	const origins = culture.origins
		.filter((o) => typeof o === "number")
		.map((cultureId) => getCultureById(cultureId, map))
		.filter((c) => c !== undefined);
	const nameBase = getNameBaseById(culture.base, map);
	const contents = createMapObjectMarkdown({
		aliases: [culture.name],
		type: "culture",
		additionalFrontMatter: {
			names: nameBase?.name ?? "Any",
			type: type,
			species: species,
			area: computeAreaFromPixels(culture.area, map),
			totalPopulation: populationNumbers.total,
			urbanPopulation: populationNumbers.urban,
			ruralPopulation: populationNumbers.rural,
		},
		title: culture.name,
		propertiesList: {
			Names: vaultLinkToMd(getLinkToNameBase(nameBase, vault)) ?? "Any",
			Type: type,
			Area: readableArea(culture.area, map),
			Population: ruralUrbanMixedPopulationString(culture, map),
			Origins: origins
				.map((originCulture) =>
					vaultLinkToMd(getLinkToCulture(originCulture, vault)),
				)
				.join(", "),
		},
		removed: culture.removed,
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

	const biome = getBiomeById(burgCell.pack.biome, map);
	const culture = getCultureById(burg.culture, map);
	const state = getStateById(burg.state, map);
	const religion = getReligionById(burgCell.pack.religion, map);
	const province = getProvinceById(burgCell.pack.province, map);

	const temperature = readableTemperature(burgCell.grid.temp, map);

	const river = getRiverById(burgCell.pack.r, map);

	const contents = createMapObjectMarkdown({
		tags: [villageOrCity],
		type: "burg",
		additionalFrontMatter: {
			population,
			temperature,
			type: burg.type,
			state: state?.name,
			culture: culture?.name,
			religion: religion?.name,
			province: province?.name,
			river: river?.name,
			location: [map.info.height - burg.y, burg.x],
			mapmarker: villageOrCity,
		},
		beforeTitle: `${mapEmbed}\n\n${emblemEmbed}`,
		title: `${burg.name}${burg.capital ? '<span title="Capital City">&Star;</span>' : ""}`,
		propertiesList: {
			Population: readablePopulation(0, population, map).total,
			Temperature: temperature,
			Biome: vaultLinkToMd(getLinkToBiome(biome, vault)),
			Culture: vaultLinkToMd(getLinkToCulture(culture, vault)),
			State: vaultLinkToMd(getLinkToState(state, vault)),
			Religion: vaultLinkToMd(getLinkToReligion(religion, vault)),
			Province: vaultLinkToMd(getLinkToProvince(province, vault)),
			Elevation: readableHeight(burgCell.pack, burgCell.grid, map),
			"Along River": vaultLinkToMd(getLinkToRiver(river, vault)),
		},
		removed: burg.removed,
	});
	return { fileName, contents };
}

export function stateToMd(
	state: INeutralState & Partial<IState>,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForState(state);
	const emblemEmbed = state.coa
		? `![floatright](${buildEmblemLink(state.coa)})`
		: undefined;
	const culture = state.culture
		? getCultureById(state.culture, map)
		: undefined;
	const contents = createMapObjectMarkdown({
		type: "state",
		additionalFrontMatter: {
			area: computeAreaFromPixels(state.area, map),
			population: computePopulation(state.rural, state.urban, map).total,
			type: state.type,
			name: state.name,
			form: state.form,
			culture: culture?.name,
		},
		beforeTitle: emblemEmbed,
		title: state.fullName ?? state.name,
		propertiesList: {
			Population: ruralUrbanMixedPopulationString(state, map),
			Area: readableArea(state.area, map),
			Capital: state.capital
				? vaultLinkToMd(getLinkToBurg(getBurgById(state.capital, map), vault))
				: undefined,
			Culture: state.culture
				? vaultLinkToMd(getLinkToCulture(culture, vault))
				: undefined,
			Type: state.type,
			"# Burgs": state.burgs.toString(),
		},
		removed: state.removed,
	});
	return { fileName, contents };
}

export function provinceToMd(
	province: IProvince,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForProvince(province);
	const emblemEmbed = `![floatright](${buildEmblemLink(province.coa)})`;
	const contents = createMapObjectMarkdown({
		aliases: [province.fullName],
		type: "province",
		additionalFrontMatter: {
			area: computeAreaFromPixels(province.area, map),
			population: computePopulation(province.rural, province.urban, map).total,
			name: province.name,
			form: province.formName,
		},
		beforeTitle: emblemEmbed,
		title: province.fullName,
		propertiesList: {
			Population: ruralUrbanMixedPopulationString(province, map),
			Area: readableArea(province.area, map),
			Capital: province.burg
				? vaultLinkToMd(getLinkToBurg(getBurgById(province.burg, map), vault))
				: undefined,
			Burgs: province.burgs.length.toString(),
		},
		removed: province.removed,
	});
	return { fileName, contents };
}

export function religionToMd(
	religion: INoReligion & Partial<IReligion>,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForReligion(religion);
	const religionPopulation = isValidReligion(religion)
		? computePopulation(religion.rural, religion.urban, map)
		: { total: 0, rural: 0, urban: 0 };
	const culture = getCultureById(religion.culture ?? 0, map);
	const culturePopulation =
		culture !== undefined
			? computePopulation(culture.rural, culture.urban, map)
			: { urban: 0, rural: 0, total: 0 };
	const percentCulturePopulation =
		culture !== undefined
			? (culturePopulation.total / religionPopulation.total) * 100
			: undefined;
	const expansion =
		religion.expansion === "global"
			? "Global"
			: `${percentCulturePopulation !== undefined ? `${Math.round(percentCulturePopulation)}% of` : "Within"} ${culture?.name ?? "Culture"}`;
	const contents = createMapObjectMarkdown({
		aliases: [religion.name],
		type: "religion",
		additionalFrontMatter: {
			population: religionPopulation.total,
			area: religion.area
				? computeAreaFromPixels(religion.area, map)
				: undefined,
			deity: religion.deity,
			name: religion.name,
			form: religion.form,
		},
		title: religion.name,
		propertiesList: {
			Population: isValidReligion(religion)
				? ruralUrbanMixedPopulationString(religion, map)
				: undefined,
			Area:
				religion.area !== undefined
					? readableArea(religion.area, map)
					: undefined,
			Culture: vaultLinkToMd(getLinkToCulture(culture, vault)),
			Expansion: expansion,
			Origins: religion.origins
				?.map((originReligionId) =>
					vaultLinkToMd(
						getLinkToReligion(getReligionById(originReligionId, map), vault),
					),
				)
				.filter(Boolean)
				.join(", "),
		},
		removed: religion.removed,
	});
	return { fileName, contents };
}

/**
 * Wiki link building Source: https://github.com/Azgaar/Fantasy-Map-Generator/blob/d42fd5cf92c371e0063b50b0c7d75424ef09378f/modules/ui/biomes-editor.js#L216
 * TODO: Compile image links to examples.
 */
const DefaultBiomes: Record<string, { wikiPage: string | undefined }> = {
	Marine: {
		wikiPage: "Marine_habitat",
	},
	"Hot desert": {
		wikiPage: "Desert_climate#Hot_desert_climates",
	},
	"Cold desert": {
		wikiPage: "Desert_climate#Cold_desert_climates",
	},
	Savanna: {
		wikiPage: "Tropical_and_subtropical_grasslands,_savannas,_and_shrublands",
	},
	Grassland: {
		wikiPage: "Temperate_grasslands,_savannas,_and_shrublands",
	},
	"Tropical seasonal forest": {
		wikiPage: "Seasonal_tropical_forest",
	},
	"Temperate deciduous forest": {
		wikiPage: "Temperate_deciduous_forest",
	},
	"Tropical rainforest": {
		wikiPage: "Tropical_rainforest",
	},
	"Temperate rainforest": {
		wikiPage: "Temperate_rainforest",
	},
	Taiga: {
		wikiPage: "Taiga",
	},
	Tundra: {
		wikiPage: "Tundra",
	},
	Glacier: {
		wikiPage: "Glacier",
	},
	Wetland: {
		wikiPage: "Wetland",
	},
};
const buildBiomeWikiLink = (biome: IBiome) => {
	const wikiBase = "https://en.wikipedia.org/wiki/";
	const defaultBiomeInfo: { wikiPage: string | undefined } | undefined =
		DefaultBiomes[biome.name];
	const biomeSearchLink = `https://en.wikipedia.org/w/index.php?search=${biome.name}`;
	return defaultBiomeInfo?.wikiPage
		? wikiBase + defaultBiomeInfo.wikiPage
		: biomeSearchLink;
};

export function biomeToMd(
	biome: IBiome,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForBiome(biome);
	const habitabilityDescriptor = [
		"Uninhabitable",
		"Extremely Hostile",
		"Barely Survivable",
		"Harsh",
		"Challenging",
		"Marginal",
		"Moderate",
		"Livable",
		"Comfortable",
		"Ideal",
		"Perfect",
	][Math.ceil(biome.habitability / 100)];
	const habitabilityStr = `${habitabilityDescriptor} (${biome.habitability}/100)`;
	const contents = createMapObjectMarkdown({
		type: "biome",
		additionalFrontMatter: {
			name: biome.name,
			habitability: habitabilityStr,
			habitabilityScore: biome.habitability,
		},
		title: biome.name,
		propertiesList: {
			Habitability: habitabilityStr,
		},
		beforeCustomContent: `[Wikipedia](${buildBiomeWikiLink(biome)})`,
	});
	return { fileName, contents };
}

export function markerToMd(
	marker: IMarker,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const note = getMarkerNote(marker, map);
	if (!note) {
		throw new Error("Encountered Marker with no Note.");
	}
	const fileName = getFileNameForMarker(marker, note);
	const markerCell = getCellById(marker.cell, map);
	const burg = markerCell ? getBurgById(markerCell.pack.burg, map) : undefined;
	const culture = markerCell
		? getCultureById(markerCell.pack.culture, map)
		: undefined;
	const province = markerCell
		? getProvinceById(markerCell.pack.province, map)
		: undefined;
	const state = markerCell
		? getStateById(markerCell.pack.state, map)
		: undefined;
	const religion = markerCell
		? getReligionById(markerCell.pack.religion, map)
		: undefined;
	const river = markerCell ? getRiverById(markerCell.pack.r, map) : undefined;

	const contents = createMapObjectMarkdown({
		type: "marker",
		tags: ["point-of-interest"],
		additionalFrontMatter: {
			name: note.name,
			location: [map.info.height - marker.y, marker.x],
			mapmarker: "marker",
			type: marker.type ?? "Unknown",
			nearbyBurg: burg?.name,
			province: province?.name,
			culture: culture?.name,
			state: state?.name,
			religion: religion?.name,
		},
		title: `${marker.icon} ${note.name}`,
		propertiesList: {
			Type: marker.type ?? "Unknown",
			"Nearby Burg": vaultLinkToMd(getLinkToBurg(burg, vault)),
			"In State": vaultLinkToMd(getLinkToState(state, vault)),
			"In Province": vaultLinkToMd(getLinkToProvince(province, vault)),
			"Nearby Culture": vaultLinkToMd(getLinkToCulture(culture, vault)),
			"Nearby Religion": vaultLinkToMd(getLinkToReligion(religion, vault)),
			"Nearby River": vaultLinkToMd(getLinkToRiver(river, vault)),
		},
		beforeCustomContent: note.legend,
	});
	return { fileName, contents };
}

export function riverToMd(
	river: IRiver,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForRiver(river);
	const lengthStr = river.length
		? map.settings.distanceUnit === "mi"
			? `${Math.round(river.length * 0.621371)} mi`
			: `${river.length} km`
		: undefined;
	const basin = getRiverById(river.basin, map);
	const parent = getRiverById(river.parent, map);
	const contents = createMapObjectMarkdown({
		type: "river",
		additionalFrontMatter: {
			name: river.name,
			type: river.type,
			basin: basin?.name,
			parent: parent?.name,
			length: river.length,
			lengthStr,
			flowRate: river.discharge,
		},
		title: river.name,
		propertiesList: {
			Type: river.type,
			Basin:
				river.basin === river.i
					? undefined
					: vaultLinkToMd(getLinkToRiver(basin, vault)),
			Parent:
				river.parent === river.i
					? undefined
					: vaultLinkToMd(getLinkToRiver(parent, vault)),
			Flow: `${river.discharge} m<sup>3</sup>/s`,
			Length: lengthStr,
		},
	});
	return { fileName, contents };
}

export function routeToMd(
	route: IRoute,
	cellIdToMarker: Map<number, IMarker>,
	cellIdToRoutes: Map<number, Map<number, IRoute>>,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForRoute(route);
	const name = getDisplayNameForRoute(route);
	const routeFeature = getFeatureById(route.feature, map);
	const lengthStr = route.length
		? map.settings.distanceUnit === "mi"
			? `${Math.round(route.length * 0.621371)} mi`
			: `${route.length} km`
		: undefined;
	const routeCells = new Map<number, IPackCell>();
	const passesByBurgs = new Map<number, IBurg>();
	const passesByMarkers = new Map<number, [IMarker, INote]>();
	const passesByOrAcrossRivers = new Map<number, IRiver>();
	const passesByOrAcrossRoutes = new Map<number, IRoute>();
	const passesThroughStates = new Map<number, IState>();
	const passesThroughProvinces = new Map<number, IProvince>();
	const passesThroughCultures = new Map<number, ICulture>();
	const passesThroughReligions = new Map<number, IReligion>();
	const passesThroughBiomes = new Map<number, IBiome>();
	for (const [x, y, cellId] of route.points) {
		// Don't process the same cell twice
		if (routeCells.has(cellId)) continue;
		const cell = getCellById(cellId, map);
		// Don't try to process off-map cells
		if (cell === undefined) continue;
		const burg = getBurgById(cell.pack.burg, map);
		if (burg !== undefined) {
			passesByBurgs.set(burg.i, burg);
		}
		const marker = cellIdToMarker.get(cellId);
		if (marker !== undefined) {
			const note = getMarkerNote(marker, map);
			if (note !== undefined) {
				passesByMarkers.set(marker.i, [marker, note]);
			}
		}
		const river = getRiverById(cell.pack.r, map);
		if (river !== undefined) {
			passesByOrAcrossRivers.set(river.i, river);
		}
		const state = getStateById(cell.pack.state, map);
		if (state !== undefined) {
			passesThroughStates.set(state.i, state);
		}
		const province = getProvinceById(cell.pack.province, map);
		if (province !== undefined) {
			passesThroughProvinces.set(province.i, province);
		}
		const culture = getCultureById(cell.pack.culture, map);
		if (culture !== undefined) {
			passesThroughCultures.set(culture.i, culture);
		}
		const religion = getReligionById(cell.pack.religion, map);
		if (religion !== undefined) {
			passesThroughReligions.set(religion.i, religion);
		}
		const biome = getBiomeById(cell.pack.biome, map);
		if (biome !== undefined) {
			passesThroughBiomes.set(biome.i, biome);
		}
		const otherRoutesInCell = cellIdToRoutes.get(cellId);
		if (otherRoutesInCell) {
			for (const passedRoute of otherRoutesInCell.values()) {
				if (passedRoute.i === route.i) continue;
				passesByOrAcrossRoutes.set(passedRoute.i, passedRoute);
			}
		}
	}
	const contents = createMapObjectMarkdown({
		type: "route",
		tags: [route.group],
		additionalFrontMatter: {
			name: name,
			group: route.group,
			length: lengthStr,
			lengthNum: route.length,
			numBurgsPassedBy: passesByBurgs.size,
			numMarkersPassedBy: passesByMarkers.size,
		},
		title: name,
		propertiesList: {
			Group: route.group,
			Length: lengthStr,
			Surface:
				routeFeature?.land === undefined
					? undefined
					: routeFeature.land
						? "Land"
						: "Water",
			"Passes by": {
				Burgs:
					Array.from(passesByBurgs.values())
						.map((burg) => vaultLinkToMd(getLinkToBurg(burg, vault)))
						.join(", ") || undefined,
				Markers:
					Array.from(passesByMarkers.values())
						.map(([marker, note]) =>
							vaultLinkToMd(getLinkToMarker(marker, note, vault)),
						)
						.join(", ") || undefined,
			},
			"Passes through": {
				States: Array.from(passesThroughStates.values())
					.map((state) => vaultLinkToMd(getLinkToState(state, vault)))
					.join(", "),
				Provinces: Array.from(passesThroughProvinces.values())
					.map((province) => vaultLinkToMd(getLinkToProvince(province, vault)))
					.join(", "),
				Cultures: Array.from(passesThroughCultures.values())
					.map((culture) => vaultLinkToMd(getLinkToCulture(culture, vault)))
					.join(", "),
				Religions: Array.from(passesThroughReligions.values())
					.map((religion) => vaultLinkToMd(getLinkToReligion(religion, vault)))
					.join(", "),
				Biomes: Array.from(passesThroughBiomes.values())
					.map((biome) => vaultLinkToMd(getLinkToBiome(biome, vault)))
					.join(", "),
			},
			"Passes by/across": {
				Rivers: Array.from(passesByOrAcrossRivers.values())
					.map((river) => vaultLinkToMd(getLinkToRiver(river, vault)))
					.join(", "),
				Routes: Array.from(passesByOrAcrossRoutes.values())
					.map((route) => vaultLinkToMd(getLinkToRoute(route, vault)))
					.join(", "),
			},
		},
	});
	return { fileName, contents };
}

export function nameBaseToMd(
	nameBase: INameBase,
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = getFileNameForNameBase(nameBase);
	const contents = createMapObjectMarkdown({
		type: "name-base",
		additionalFrontMatter: {
			name: nameBase.name,
		},
		title: nameBase.name,
		propertiesList: {},
	});
	return { fileName, contents };
}

export function createMapHomepage(
	map: IJsonMapEx,
	vault: IVaultDirectory,
): IMarkdownNote {
	const fileName = worldDirectoryName;
	const globalRuralPopulation = map.pack.cultures.reduce(
		(accumulator, currentValue) => accumulator + currentValue.rural,
		0,
	);
	const globalUrbanPopulation = map.pack.cultures.reduce(
		(accumulator, currentValue) => accumulator + currentValue.urban,
		0,
	);
	const globalTerritoryArea = map.pack.provinces.reduce(
		(accumulator, currentValue) => accumulator + (currentValue.area ?? 0),
		0,
	);
	const leaflet = toYAML({
		id: `${map.info.mapName}-map`,
		image: `[[${path.join(vault.assets.relative, `${map.info.mapName.toLowerCase()}.svg`)}]]`,
		markerTag: ["#marker", "#burg"],
		lock: true,
		height: "500px",
		bounds: [
			[0, 0],
			[map.info.height, map.info.width],
		],
		lat: map.info.height / 2,
		long: map.info.width / 2,
		minZoom: -1.5,
		maxZoom: 2.5,
		defaultZoom: -1,
		zoomDelta: 0.5,
		unit: map.settings.distanceUnit,
		scale:
			typeof map.settings.distanceScale === "string"
				? Number.parseInt(map.settings.distanceScale)
				: map.settings.distanceScale,
	});
	const contents = `
# ${map.info.mapName}

${map.info.description}

\`\`\`leaflet
${leaflet}
\`\`\`

> View the full map at [Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/) by loading \`${vault.assets.relative}/${map.info.mapName.toLowerCase()}.map\`.

${propertyListToMd({
	Population: ruralUrbanMixedPopulationString(
		{ rural: globalRuralPopulation, urban: globalUrbanPopulation },
		map,
	),
	"Territory Area": readableArea(globalTerritoryArea, map),
	States: map.pack.states
		.map((s) => vaultLinkToMd(getLinkToState(s, vault)))
		.join(", "),
	Cultures: map.pack.cultures
		.map((c) => vaultLinkToMd(getLinkToCulture(c, vault)))
		.join(", "),
	Religions: map.pack.religions
		.map((r) => vaultLinkToMd(getLinkToReligion(r, vault)))
		.join(", "),
})}

${CustomContentString}
`;
	return { fileName, contents };
}
