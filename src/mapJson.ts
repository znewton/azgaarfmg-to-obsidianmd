import type { IBiome, IJsonMap } from "./definitions";

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
