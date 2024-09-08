import type {
	IBiome,
	IBurg,
	ICulture,
	IGridCell,
	IJsonMap,
	IJsonMapEx,
	IMarker,
	INameBase,
	INeutralState,
	INoReligion,
	INote,
	IPackCell,
	IPackFeature,
	IProvince,
	IRegiment,
	IReligion,
	IRiver,
	IState,
	IWildCulture,
} from "./definitions";

/**
 * Compute area in distance from pixels based on map's distanceScale.
 */
export function computeAreaFromPixels(
	areaInPixels: number,
	map: IJsonMap,
): number {
	const scale =
		typeof map.settings.distanceScale === "string"
			? Number.parseInt(map.settings.distanceScale)
			: map.settings.distanceScale;
	return Math.round(areaInPixels * scale ** 2);
}

/**
 * Compute population based on rural and urban population points
 * and the map's populationRate.
 */
export function computePopulation(
	ruralPopulationPoints: number,
	urbanPopulationPoints: number,
	map: IJsonMap,
): { total: number; rural: number; urban: number } {
	return {
		total: Math.round(
			(ruralPopulationPoints + urbanPopulationPoints) *
				map.settings.populationRate,
		),
		urban: Math.round(urbanPopulationPoints * map.settings.populationRate),
		rural: Math.round(ruralPopulationPoints * map.settings.populationRate),
	};
}

/**
 * Get a culture from a map by index/id.
 */
export function getCultureById(id: 0, map: IJsonMap): IWildCulture;
export function getCultureById(id: number, map: IJsonMap): ICulture | undefined;
export function getCultureById(
	id: number,
	map: IJsonMap,
): IWildCulture | ICulture | undefined {
	return map.pack.cultures.find((c) => c.i === id);
}

/**
 * Get a state from a map by index/id.
 */
export function getStateById(id: 0, map: IJsonMap): INeutralState;
export function getStateById(id: number, map: IJsonMap): IState | undefined;
export function getStateById(
	id: number,
	map: IJsonMap,
): IState | INeutralState | undefined {
	return map.pack.states.find((s) => s.i === id);
}

/**
 * Get a burg from a map by index/id.
 */
export function getBurgById(id: number, map: IJsonMap): IBurg | undefined {
	return map.pack.burgs.find((p) => p.i === id);
}

/**
 * Get a province from a map by index/id.
 */
export function getProvinceById(
	id: number,
	map: IJsonMap,
): IProvince | undefined {
	return map.pack.provinces.find((p) => p.i === id);
}

/**
 * Get a religion from a map by index/id.
 */
export function getReligionById(id: 0, map: IJsonMap): INoReligion;
export function getReligionById(
	id: number,
	map: IJsonMap,
): IReligion | undefined;
export function getReligionById(
	id: number,
	map: IJsonMap,
): IReligion | INoReligion | undefined {
	return map.pack.religions.find((r) => r.i === id);
}

/**
 * Get a Grid and Pack cell by Pack Cell Id.
 */
export function getCellById(
	packCellId: number,
	map: IJsonMap,
): { grid: IGridCell; pack: IPackCell } | undefined {
	const packCell = map.pack.cells.find((pc) => pc.i === packCellId);
	if (packCell === undefined) return undefined;
	const gridCell = map.grid.cells.find((gc) => gc.i === packCell.g);
	if (gridCell === undefined) return undefined;
	return {
		pack: packCell,
		grid: gridCell,
	};
}

export function getFeatureById(
	id: number,
	map: IJsonMap,
): IPackFeature | undefined {
	return map.pack.features.find((f) => f.i === id);
}

export function getRiverById(id: number, map: IJsonMap): IRiver | undefined {
	return map.pack.rivers.find((r) => r.i === id);
}

export function getMarkerById(id: number, map: IJsonMap): IMarker | undefined {
	return map.pack.markers.find((m) => m.i === id);
}

export function getMarkerNote(
	marker: IMarker,
	map: IJsonMap,
): INote | undefined {
	return map.notes.find((n) => n.id === `marker${marker.i}`);
}

export function getRegimentNote(
	regiment: IRegiment,
	map: IJsonMap,
): INote | undefined {
	return map.notes.find((n) => n.id === `regiment${regiment.i}-${regiment.n}`);
}

export function getNameBaseById(
	id: number,
	map: IJsonMap,
): INameBase | undefined {
	return map.nameBases.find((n, i) => i === id);
}

/**
 * Get a Biome by id.
 */
export function getBiomeById(id: number, map: IJsonMapEx): IBiome | undefined {
	return map.biomes.find((b) => b.i === id);
}

export function buildBiomes(map: IJsonMap): IBiome[] {
	const biomes: IBiome[] = [];
	for (const index of map.biomesData.i) {
		biomes.push({
			i: index,
			name: map.biomesData.name[index],
			color: map.biomesData.color[index],
			cost: map.biomesData.cost[index],
			habitability: map.biomesData.habitability[index],
			icons: map.biomesData.icons[index],
			iconsDensity: map.biomesData.iconsDensity[index],
			biomesMartix: map.biomesData.biomesMartix,
		});
	}
	return biomes;
}

/**
 * Creates map of cells linked to other cells by routes.
 */
export function buildRouteLinks(
	map: IJsonMap,
): Record<number, Record<number, number>> {
	const links: Record<number, Record<number, number>> = {};

	for (const { points, i: routeId } of map.pack.routes) {
		const cells = points.map((p) => p[2]);

		for (let i = 0; i < cells.length - 1; i++) {
			const cellId = cells[i];
			const nextCellId = cells[i + 1];

			if (cellId !== nextCellId) {
				if (!links[cellId]) links[cellId] = {};
				links[cellId][nextCellId] = routeId;

				if (!links[nextCellId]) links[nextCellId] = {};
				links[nextCellId][cellId] = routeId;
			}
		}
	}

	return links;
}

export function cellIsCrossroad(cell: IPackCell, map: IJsonMapEx) {
	const connections = map.routeLinks[cell.i];
	if (!connections) return false;
	return (
		Object.keys(connections).length > 3 ||
		Object.values(connections).filter(
			(routeId) => map.pack.routes[routeId]?.group === "roads",
		).length > 2
	);
}

export function getLatLongFromXY(
	x: number,
	y: number,
	map: IJsonMap,
): { latitude: number; longitude: number } {
	return {
		latitude:
			map.mapCoordinates.latS + (y / map.info.height) * map.mapCoordinates.latT,
		longitude:
			map.mapCoordinates.lonW + (x / map.info.width) * map.mapCoordinates.lonT,
	};
}
