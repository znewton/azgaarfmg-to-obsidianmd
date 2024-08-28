export interface IMapFileSettings {
	pinNotes: boolean;
	winds: number[];
	/**
	 * Temperature at the equator.
	 */
	temperatureEquator: number;
	/**
	 * Temperature at the North Pole.
	 */
	temperatureNorthPole: number;
	/**
	 * Temperature at the South Pole.
	 */
	temperatureSouthPole: number;
	stateLabelsMode: string;
	showBurgPreview: boolean;
	/**
	 * Max population of a Burg to be considered a village.
	 * If population is greater, it is considered a city.
	 */
	villageMaxPopulation: number;
	/**
	 * Current year in the world's calendar.
	 */
	year: number;
	/**
	 * Current Era in the worlds timeline.
	 */
	era: string;
	/**
	 * An abbreviated version of the Era (e.g. Rocleston Era -> RE)
	 * to be used when listing a year in an era (e.g. 1008 RE).
	 */
	eraShort: string;
	/**
	 * List of military settings for simulating combat.
	 */
	military: object[];
}

export interface IMapMetadata
	extends Pick<
		IMapFileSettings,
		"villageMaxPopulation" | "year" | "era" | "eraShort"
	> {
	/**
	 * File version (e.g. 1.99.03)
	 */
	version: string;
	/**
	 * Tip telling the opener of the file how to load it.
	 */
	tip: string;
	/**
	 * Date created as Milliseconds since epoch.
	 */
	createdTimestamp: number;
	/**
	 * Unique seed number used for generating towns and such.
	 */
	seed: number;
	/**
	 * Original width of the map in pixels.
	 */
	width: number;
	/**
	 * Original height of the map in pixels.
	 */
	height: number;
	/**
	 * Unique id number (as far as I can tell).
	 */
	id: number;
	/**
	 * Unit for labeling distances (e.g. mi, km)
	 */
	distanceUnit: string;
	/**
	 * Distance covered by 1 pixel (e.g. 4 means 1 pixel is 4 of distanceUnit).
	 */
	distanceScale: number;
	/**
	 * Unit for labeling areas (e.g. square)
	 */
	areaUnit: string;
	/**
	 * Unit for labeling heights (e.g. ft, m)
	 */
	heightUnit: string;
	/**
	 * Unit for labeling temperature (e.g. °F, °C)
	 */
	temperatureUnit: string;
	/**
	 * Number of people per population point.
	 */
	populationRate: number;
	/**
	 * Name of the world shown in the map.
	 */
	worldName: string;
	/**
	 * Total Latitude displayed by map.
	 */
	totalLatitude: number;
	/**
	 * Total Longitude displayed by map.
	 */
	totalLongitude: number;
	/**
	 * North latitude bound.
	 */
	latitudeNorth: number;
	/**
	 * South latitude bound.
	 */
	latitudeSouth: number;
	/**
	 * West longitude bound.
	 */
	longitudeWest: number;
	/**
	 * East longitude bound.
	 */
	longitudeEast: number;
	/**
	 * List of biome names.
	 */
	biomes: string[];
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Cultures
 */
export interface ICulture {
	/**
	 * culture id, always equal to the array index
	 */
	i: number;
	/**
	 * nameBase id, name base is used for names generation
	 */
	base: number;
	/**
	 * culture name
	 */
	name: string;
	/**
	 * ids of origin cultures.
	 * Used to render cultures tree to show cultures evolution.
	 * The first array member is main link, other - supporting out-of-tree links
	 */
	origins: (number | null)[];
	/**
	 * shield type. Used for emblems rendering
	 */
	shield: string;
	/**
	 * cell id of culture center (initial cell)
	 */
	center: number;
	/**
	 * culture name abbreviation. Used to render cultures tree
	 */
	code: string;
	/**
	 * culture color in hex (e.g. #45ff12) or link to hatching pattern (e.g. url(#hatch7))
	 */
	color: string;
	/**
	 * culture growth multiplier. Used mainly during cultures generation to spread cultures not uniformly
	 */
	expansionism: number;
	/**
	 * culture type, see culture types
	 */
	type: string;
	/**
	 * culture area in pixels
	 */
	area: number;
	/**
	 * number of cells assigned to culture
	 */
	cells: number;
	/**
	 * rural (non-burg) population of cells assigned to culture. In population points
	 */
	rural: number;
	/**
	 * urban (burg) population of cells assigned to culture. In population points
	 */
	urban: number;
	/**
	 * true if culture is locked (not affected by regeneration)
	 */
	lock?: boolean;
	/**
	 * true if culture is removed
	 */
	removed?: boolean;
}
export type IWildCulture = Omit<
	ICulture,
	"center" | "code" | "color" | "expansionism" | "type"
>;

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Burgs
 */
export interface IBurg {
	/**
	 * burg id, always equal to the array index
	 */
	i: number;
	/**
	 * burg name
	 */
	name: string;
	/**
	 * burg cell id. One cell can have only one burg
	 */
	cell: number;
	/**
	 * x axis coordinate, rounded to two decimals
	 */
	x: number;
	/**
	 * y axis coordinate, rounded to two decimals
	 */
	y: number;
	/**
	 * burg culture id
	 */
	culture: number;
	/**
	 * burg state id
	 */
	state: number;
	/**
	 * burg feature id (id of a landmass)
	 */
	feature: number;
	/**
	 * burg population in population points
	 */
	population: number;
	/**
	 * burg type, see culture types
	 */
	type: string;
	/**
	 * emblem object, data model is the same as in Armoria and covered in API documentation. The only additional fields are optional size: number, x: number and y: number that controls the emblem position on the map (if it's not default). If emblem is loaded by user, then the value is { custom: true } and cannot be displayed in Armoria
	 */
	coa: object;
	/**
	 * burg seed in Medieval Fantasy City Generator (MFCG). If not provided, seed is combined from map seed and burg id
	 */
	MFCG?: number;
	/**
	 * custom link to burg in MFCG. MFCG seed is not used if link is provided
	 */
	link?: string;
	/**
	 * 1 if burg is a capital, 0 if not (each state has only 1 capital)
	 */
	capital: number;
	/**
	 * if burg is not a port, then 0, otherwise feature id of the water body the burg stands on
	 */
	port: number;
	/**
	 * 1 if burg has a castle, 0 if not. Used for MFCG
	 */
	citadel: number;
	/**
	 * 1 if burg has a marketplace, 0 if not. Used for MFCG
	 */
	plaza: number;
	/**
	 * 1 if burg has a shanty town, 0 if not. Used for MFCG
	 */
	shanty: number;
	/**
	 * 1 if burg has a temple, 0 if not. Used for MFCG
	 */
	temple: number;
	/**
	 * 1 if burg has walls, 0 if not. Used for MFCG
	 */
	walls: number;
	/**
	 * true if burg is locked (not affected by regeneration)
	 */
	lock?: boolean;
	/**
	 * true if burg is removed
	 */
	removed?: boolean;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#States
 */
export interface IState {
	/**
	 * state id, always equal to the array index
	 */
	i: number;
	/**
	 * short (proper) form of the state name
	 */
	name: string;
	/**
	 * state form type. Available types are Monarchy, Republic, Theocracy, Union, and Anarchy
	 */
	form: string;
	/**
	 * string form name, used to get state fullName
	 */
	formName: string;
	/**
	 * full state name. Combination of the proper name and state formName
	 */
	fullName: string;
	/**
	 * id of the capital burg
	 */
	capital?: number;
	/**
	 * state color in hex (e.g. #45ff12) or link to hatching pattern (e.g. url(#hatch7))
	 */
	color: string;
	/**
	 * cell id of state center (initial cell)
	 */
	center: number;
	/**
	 * state pole of inaccessibility (visual center) coordinates, see the concept description
	 */
	pole: number[];
	/**
	 * state culture id (equals to initial cell culture)
	 */
	culture: number;
	/**
	 * state type, see [culture types](https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Culture types)
	 */
	type: string;
	/**
	 * state growth multiplier. Used mainly during state generation to spread states not uniformly
	 */
	expansionism: number;
	/**
	 * state area in pixels
	 */
	area: number;
	/**
	 * number of burgs within the state
	 */
	burgs: number;
	/**
	 * number of cells within the state
	 */
	cells: number;
	/**
	 * rural (non-burg) population of state cells. In population points
	 */
	rural: number;
	/**
	 * urban (burg) population of state cells. In population points
	 */
	urban: number;
	/**
	 * ids of neighboring (bordering by land) states
	 */
	neighbors: number[];
	/**
	 * ids of state provinces
	 */
	provinces: number[];
	/**
	 * diplomatic relations status for all states. 'x' for self and neutrals. Element 0 (neutrals) diplomacy is used differently and contains wars story as string[][]
	 */
	diplomacy: string[];
	/**
	 * wars the state participated in. The was is defined as start: number (year), end: number (year), name: string
	 */
	campaigns: object[];
	/**
	 * state war alert, see military forces page
	 */
	alert: number;
	/**
	 * list of state regiments, see military forces page
	 */
	military: IRegiment[];
	/**
	 * emblem object, data model is the same as in Armoria and covered in API documentation. The only additional fields are optional size: number, x: number and y: number that controls the emblem position on the map (if it's not default). If emblem is loaded by user, then the value is { custom: true } and cannot be displayed in Armoria
	 */
	coa: object;
	/**
	 * true if state is locked (not affected by regeneration)
	 */
	lock?: boolean;
	/**
	 * true if state is removed
	 */
	removed?: boolean;
}
export type INeutralState = Pick<
	IState,
	| "i"
	| "name"
	| "urban"
	| "rural"
	| "burgs"
	| "area"
	| "cells"
	| "neighbors"
	| "diplomacy"
	| "provinces"
>;

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Regiments
 */
export interface IRegiment {
	/**
	 * regiment id, equals to the array index of regiment in the state[x].military array. Not unique, as unique string regimentStateId-regimentId is used
	 */
	i: number;
	/**
	 * regiment x coordinate
	 */
	x: number;
	/**
	 * regiment y coordinate
	 */
	y: number;
	/**
	 * regiment base x coordinate
	 */
	bx: number;
	/**
	 * regiment base y coordinate
	 */
	by: number;
	/**
	 * regiment rotation angle degree
	 */
	a: number;
	/**
	 * Unicode character to serve as an icon
	 */
	icon: string;
	/**
	 * original regiment cell id
	 */
	cell: number;
	/**
	 * regiment state id
	 */
	state: number;
	/**
	 * regiment name
	 */
	name: string;
	/**
	 * 1 if regiment is a separate unit (like naval units), 0 is not
	 */
	n: number;
	/**
	 * regiment content object, unitName-Number pair
	 */
	u: Record<string, number | undefined>;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Provinces
 */
export interface IProvince {
	/**
	 * province id, always equal to the array index
	 */
	i: number;
	/**
	 * short (proper) form of the province name
	 */
	name: string;
	/**
	 * string form name, used to get province fullName
	 */
	formName: string;
	/**
	 * full state name. Combination of the proper name and province formName
	 */
	fullName: string;
	/**
	 * province color in hex (e.g. #45ff12) or link to hatching pattern (e.g. url(#hatch7))
	 */
	color: string;
	/**
	 * cell id of province center (initial cell)
	 */
	center: number;
	/**
	 * state pole of inaccessibility (visual center) coordinates, see the concept description
	 */
	pole: number[];
	/**
	 * province area in pixels
	 */
	area: number;
	/**
	 * id of province capital burg if any
	 */
	burg: number;
	/**
	 * id of burgs within the province. Optional (added when Province editor is opened)
	 */
	burgs?: number[];
	/**
	 * number of cells within the province
	 */
	// cells: number;
	/**
	 * rural (non-burg) population of province cells. In population points
	 */
	rural: number;
	/**
	 * urban (burg) population of state province. In population points
	 */
	urban: number;
	/**
	 * emblem object, data model is the same as in Armoria and covered in API documentation. The only additional fields are optional size: number, x: number and y: number that controls the emblem position on the map (if it's not default). If emblem is loaded by user, then the value is { custom: true } and cannot be displayed in Armoria
	 */
	coa: object;
	/**
	 * true if province is locked (not affected by regeneration)
	 */
	lock?: boolean;
	/**
	 * true if province is removed
	 */
	removed?: boolean;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Religions
 */
export interface IReligion {
	/**
	 * religion id, always equal to the array index
	 */
	i: number;
	/**
	 * religion name
	 */
	name: string;
	/**
	 * religion type. Available types are Folk, Organized, Heresy and Cult
	 */
	type: string;
	/**
	 * religion form
	 */
	form: string;
	/**
	 * religion supreme deity if any
	 */
	deity: string | null;
	/**
	 * religion color in hex (e.g. #45ff12) or link to hatching pattern (e.g. url(#hatch7))
	 */
	color: string;
	/**
	 * religion name abbreviation. Used to render religions tree
	 */
	code: string;
	/**
	 * ids of ancestor religions. [0] if religion doesn't have an ancestor. Used to render religions tree. The first array member is main link, other - supporting out-of-tree links
	 */
	origins: number[] | null;
	/**
	 * cell id of religion center (initial cell)
	 */
	center: number;
	/**
	 * religion original culture
	 */
	culture: number;
	/**
	 * state pole of inaccessibility (visual center) coordinates, see the concept description
	 */
	pole?: number[];
	/**
	 * religion growth multiplier. Used during religion generation to define competitive size
	 */
	expansionism: number;
	/**
	 * religion expansion type. Can be culture so that religion grow only within its culture or global
	 */
	expansion: string;
	/**
	 * religion area in pixels
	 */
	area: number;
	/**
	 * number of cells within the religion
	 */
	cells: number;
	/**
	 * rural (non-burg) population of religion cells. In population points
	 */
	rural: number;
	/**
	 * urban (burg) population of state religion. In population points
	 */
	urban: number;
	/**
	 * true if religion is locked (not affected by regeneration)
	 */
	lock?: boolean;
	/**
	 * true if religion is removed
	 */
	removed?: boolean;
}
export type INoReligion = Pick<IReligion, "i" | "name" | "origins">;

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Rivers
 */
export interface IRiver {
	/**
	 * river id
	 */
	i: number;
	/**
	 * river name
	 */
	name: string;
	/**
	 * river type, used to get river full name only
	 */
	type: string;
	/**
	 * id of cell at river source
	 */
	source: number;
	/**
	 * id of cell at river mouth
	 */
	mouth: number;
	/**
	 * parent river id. If river doesn't have a parent, the value is self id or 0
	 */
	parent: number;
	/**
	 * river basin id. Basin id is a river system main stem id. If river doesn't have a parent, the value is self id
	 */
	basin: number;
	/**
	 * if of river points cells. Cells may not be unique. Cell value -1 means the river flows off-canvas
	 */
	cells: number[];
	/**
	 * river points coordinates. Auto-generated rivers don't have points stored and rely on cells for rendering
	 */
	points?: number[][];
	/**
	 * river flux in m3/s
	 */
	discharge: number;
	/**
	 * river length in km
	 */
	length: number;
	/**
	 * river mouth width in km
	 */
	width: number;
	/**
	 * additional width added to river source on rendering. Used to make lake outlets start with some width depending on flux. Can be also used to manually create channels
	 */
	sourceWidth: number;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Markers
 */
export interface IMarker {
	/**
	 * marker id. 'marker' + i is used as svg element id and marker reference in notes object
	 */
	i: number;
	/**
	 * Unicode character (usually an emoji) to serve as an icon
	 */
	icon: string;
	/**
	 * marker x coordinate
	 */
	x: number;
	/**
	 * marker y coordinate
	 */
	y: number;
	/**
	 * cell id, used to prevent multiple markers generation in the same cell
	 */
	cell: number;
	/**
	 * marker type. If set, style changes will be applied to all markers of the same type. Optional
	 */
	type?: string;
	/**
	 * marker size in pixels. Optional, default value is 30 (30px)
	 */
	size?: number;
	/**
	 * marker pin fill color. Optional, default is #fff (white)
	 */
	fill?: string;
	/**
	 * marker pin stroke color. Optional, default is #000 (black)
	 */
	stroke?: string;
	/**
	 * pin element type. Optional, default is bubble. Pin is not rendered if value is set to no
	 */
	pin?: string;
	/**
	 * if any marker is pinned, then only markers with pinned = true will be rendered. Optional
	 */
	pinned?: boolean;
	/**
	 * icon x shift percent. Optional, default is 50 (50%, center)
	 */
	dx?: number;
	/**
	 * icon y shift percent. Optional, default s 50 (50%, center)
	 */
	dy?: number;
	/**
	 * icon font-size in pixels. Optional, default is 12 (12px)
	 */
	px?: number;
	/**
	 * true if marker is locked (not affected by regeneration). Optional
	 */
	lock?: boolean;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Routes
 */
export interface IRoute {
	/**
	 * route id. Please note the element with id 0 is a fully valid route, not a placeholder
	 */
	i: number;
	/**
	 * array of control points in format [x, y, cellId]
	 */
	points: number[][];
	/**
	 * feature id of the route. Auto-generated routes cannot be place on multiple features
	 */
	feature: number;
	/**
	 * route group. Default groups are: 'roads', 'trails', 'searoutes'
	 */
	group: string;
	/**
	 * route length in km. Optional
	 */
	length?: number;
	/**
	 * route name. Optional
	 */
	name?: string;
	/**
	 * true if route is locked (not affected by regeneration). Optional
	 */
	lock?: boolean;
}

/**
 * TODO: Does not appear to be included in .map
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Biomes
 */
export interface IBiome {
	/**
	 * biome id
	 */
	i: number[];
	/**
	 * biome names
	 */
	name: string[];
	/**
	 * biome colors in hex (e.g. #45ff12) or link to hatching pattern (e.g. url(#hatch7))
	 */
	color: string[];
	/**
	 * 2d matrix used to define cell biome by temperature and moisture. Columns contain temperature data going from > 19 °C to < -4 °C. Rows contain data for 5 moisture bands from the drier to the wettest one. Each row is a Uint8Array
	 */
	biomesMartix: number[][];
	/**
	 * biome movement cost, must be 0 or positive. Extensively used during cultures, states and religions growth phase. 0 means spread to this biome costs nothing. Max value is not defined, but 5000 is the actual max used by default
	 */
	cost: number[];
	/**
	 * biome habitability, must be 0 or positive. 0 means the biome is uninhabitable, max value is not defined, but 100 is the actual max used by default
	 */
	habitability: number[];
	/**
	 * non-weighed array of icons for each biome. Used for relief icons rendering. Not-weighed means that random icons from array is selected, so the same icons can be mentioned multiple times
	 */
	icons: string[][];
	/**
	 * defines how packed icons can be for the biome. An integer from 0 to 150
	 */
	iconsDensity: number[];
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#Notes
 */
export interface INote {
	/**
	 * note id
	 */
	id: string;
	/**
	 * note name, visible in Legend box
	 */
	name: string;
	/**
	 * note text in html
	 */
	legend: string;
}

/**
 * TODO: Does not appear to be included in .map file
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#NameBases
 */
export interface INameBase {
	/**
	 * base id, always equal to the array index
	 */
	i: number;
	/**
	 * names base proper name
	 */
	name: string;
	/**
	 * long string containing comma-separated list of names
	 */
	b?: string;
	/**
	 * recommended minimal length of generated names. Generator will adding new syllables until min length is reached
	 */
	min: number;
	/**
	 * recommended maximal length of generated names. If max length is reached, generator will stop adding new syllables
	 */
	max: number;
	/**
	 * letters that are allowed to be duplicated in generated names
	 */
	d: string;
	/**
	 * if multi-word name is generated, how many of this cases should be transformed into a single word.
	 * 0 means multi-word names are not allowed,
	 * 1 - all generated multi-word names will stay as they are
	 */
	m: number;
}

export interface IMap {
	metadata: IMapMetadata;
	cultures: (IWildCulture & Partial<ICulture>)[];
	burgs: IBurg[];
	states: (INeutralState & Partial<IState>)[];
	regiments: IRegiment[];
	provinces: IProvince[];
	religions: (INoReligion & Partial<IReligion>)[];
	rivers: IRiver[];
	markers: IMarker[];
	routes: IRoute[];
	biomes: IBiome[];
	notes: INote[];
	nameBases: INameBase[];
}

// ---
// JSON Map Version Below
// ---

export interface IMapInfo {
	/**
	 * Unique seed number used for generating towns and such.
	 */
	seed: string;
	/**
	 * Original width of the map in pixels.
	 */
	width: number;
	/**
	 * Original height of the map in pixels.
	 */
	height: number;
	/**
	 * File version (e.g. 1.99.03)
	 */
	version: string;
	/**
	 * Note indicating where file was generated from.
	 */
	description: string;
	/**
	 * Date created as Milliseconds since epoch.
	 */
	exportedAt: string;
	/**
	 * Name of the map/world.
	 */
	mapName: string;
	/**
	 * Unique identifier for this version of the map.
	 */
	mapId: number;
}

export interface IMapSettingsOptions {
	pinNotes: boolean;
	winds: number[];
	/**
	 * Temperature at the equator.
	 */
	temperatureEquator: number;
	/**
	 * Temperature at the North Pole.
	 */
	temperatureNorthPole: number;
	/**
	 * Temperature at the South Pole.
	 */
	temperatureSouthPole: number;
	stateLabelsMode: string;
	showBurgPreview: boolean;
	/**
	 * Max population of a Burg to be considered a village.
	 * If population is greater, it is considered a city.
	 */
	villageMaxPopulation: number;
	/**
	 * Current year in the world's calendar.
	 */
	year: number;
	/**
	 * Current Era in the worlds timeline.
	 */
	era: string;
	/**
	 * An abbreviated version of the Era (e.g. Rocleston Era -> RE)
	 * to be used when listing a year in an era (e.g. 1008 RE).
	 */
	eraShort: string;
	/**
	 * List of military settings for simulating combat.
	 */
	military: object[];
}

export interface IMapSettings {
	/**
	 * Unit for labeling distances (e.g. mi, km)
	 */
	distanceUnit: string;
	/**
	 * Distance covered by 1 pixel (e.g. 4 means 1 pixel is 4 of distanceUnit).
	 */
	distanceScale: number;
	/**
	 * Unit for labeling areas (e.g. square)
	 */
	areaUnit: string;
	/**
	 * Unit for labeling heights (e.g. ft, m)
	 */
	heightUnit: string;
	heightExponent: number;
	/**
	 * Unit for labeling temperature (e.g. °F, °C)
	 */
	temperatureScale: string;
	/**
	 * Number of people per population point.
	 */
	populationRate: number;
	/**
	 * Name of the world shown in the map.
	 */
	mapName: string;
	/**
	 * Options used when generating the map.
	 */
	options: IMapSettingsOptions;
	/**
	 * Number parsable string. ???
	 */
	urbanization: string;
	/**
	 * Number parsable string. ???
	 */
	mapSize: string;
	/**
	 * Number parsable string. Indicates central latitude of map.
	 */
	latitude: string;
	/**
	 * Number parsable string. Indicates central longitude of map.
	 */
	longitude: string;
	/**
	 * Number parsable string. Precipitation factor?
	 */
	prec: string;
	hideLabels: boolean;
	stylePreset: string;
	rescaleLabels: boolean;
	urbanDensity: 10;
}

interface IMapCoordinates {
	/**
	 * Total Latitude displayed by map.
	 */
	latT: number;
	/**
	 * Total Longitude displayed by map.
	 */
	lonT: number;
	/**
	 * North latitude bound.
	 */
	latN: number;
	/**
	 * South latitude bound.
	 */
	latS: number;
	/**
	 * West longitude bound.
	 */
	lonW: number;
	/**
	 * East longitude bound.
	 */
	lonE: number;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#specific-cells-data
 */
export interface IPackCell {
	/**
	 * Cell Id/index.
	 */
	i: number;
	/**
	 * Vertex indices.
	 */
	v: number[];
	/**
	 * Adjacent cell indices.
	 */
	c: number[];
	/**
	 * Cell's coordinates after repacking, rounded to 2 decimals.
	 */
	p: [number, number];
	/**
	 * Grid cell parent index.
	 * Use this to find associated grid cell for determining temperature.
	 */
	g: number;
	/**
	 * Elevation from 0-100. 20 is minimal land elevation.
	 */
	h: number;
	/**
	 * Feature index.
	 */
	f: number;
	/**
	 * distance field.
	 * 1, 2, ... - land cells
	 * -1, -2, ... - water cells
	 * 0 - unmarked cell
	 */
	t: number;
	/**
	 * River index.
	 */
	r: number;
	/**
	 * Flux amount.
	 * HDefines how much water flows through the cell.
	 */
	fl: number;
	/**
	 * Score.
	 * sed to define best cells to place a burg.
	 */
	s: number;
	/**
	 * Area in pixels.
	 */
	area: number;
	/**
	 * Haven index.
	 * Coastal cells have haven cells defined for route building.
	 */
	haven: number;
	/**
	 * Harbor Score.
	 * Shows how many water cells are adjacent.
	 */
	harbor: number;
	/**
	 * Flux amount in confluences.
	 * Confluences are cells where rivers meet each other.
	 */
	conf: number;
	/**
	 * Biome index.
	 */
	biome: number;
	/**
	 * Population in population points.
	 * Multiply by populationRate.
	 */
	pop: number;
	/**
	 * Culture index.
	 */
	culture: number;
	/**
	 * Burg index.
	 */
	burg: number;
	/**
	 * State index.
	 */
	state: number;
	/**
	 * Religion index.
	 */
	religion: number;
	/**
	 * Province index.
	 */
	province: number;
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#voronoi-data
 */
export interface IPackVertex {
	/**
	 * Vertex index.
	 */
	i: number;
	/**
	 * Vertex coordinates [x, y] integers
	 */
	p: [number, number];
	/**
	 * Adjacent vertex indexes.
	 * Bordering vertices only have 2, but the third is -1.
	 */
	v: [number, number, number];
	/**
	 * Adjacent cell indexes.
	 */
	c: [number, number, number];
}

/**
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#features-data
 */
export interface IPackFeature {
	/**
	 * Feature Index
	 */
	i: number;
	/**
	 * If feature is land (height >= 20)
	 */
	land: boolean;
	/**
	 * If feature touches map border.
	 */
	border: boolean;
	/**
	 * Feature type: ocean, island, lake.
	 */
	type: string;
	/**
	 * Number of cells within feature.
	 */
	cells: number;
	/**
	 * Index of the first (top left) cell in feature.
	 */
	firstCell: number;
	/**
	 * Subtype depending on type.
	 * Ocean => ocean
	 * Land => continent
	 */
	group: string;
	/**
	 * Area of the feature in pixels.
	 */
	area?: number;
	/**
	 * List of perimeter vertices around the feature.
	 */
	vertices?: number[];
	/**
	 * Feature name.
	 * Only available for lake type.
	 */
	name?: string;
}

/**
 * Biomes as arrays.
 * Each biome is in order. Example: i[0] is for the same biome as name[0].
 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#biomes
 */
export interface IBiomesData {
	/**
	 * Biome Ids.
	 */
	i: number[];
	/**
	 * Biome names.
	 */
	name: string[];
	/**
	 * Biome colors in hex or link to hatch pattern
	 */
	color: string[];
	/**
	 * Biome matrix.
	 * 2d Matrix used to define cell biome by temperature and moisture.
	 * Columns contain temperature data going from > 19 °C to < -4 °C.
	 * In reality, columns are 0-25, so must be adjusted by -5.
	 * Rows contain data for 5 moisture bands from the drier to the wettest one.
	 *
	 * Yes, Matrix is misspelled in the data.
	 */
	biomesMartix: number[][];
	/**
	 * Biome movement cost from 0-5000.
	 * Used for determining culture, state, and religion growth.
	 * 0 means spreading to this biome costs nothing, higher is more costly.
	 */
	cost: number[];
	/**
	 * Biome habitability score from 0-100.
	 * 0 means biome is uninhabitable, higher is more easily habitable.
	 */
	habitability: number[];
	/**
	 * Non-weighted array of icons for each biome.
	 * Used for "relief" icons rendering.
	 * During rendering, random icons are chosen from the array with no preference.
	 */
	icons: string[][];
	/**
	 * Icon density from 0-150.
	 * Defines how packed icons can be for the biome.
	 */
	iconsDensity: number[];
}

export interface IGridCell {
	/**
	 * Cell index.
	 * Matches to IPackCell.g
	 */
	i: number;
	/**
	 * Indexes of vertices.
	 */
	v: number[];
	/**
	 * Indexes of adjacent cells.
	 */
	c: number[];
	/**
	 * Whether cell borders map edge.
	 * 1 if true, 0 if false.
	 */
	b: number;
	/**
	 * Feature index.
	 */
	f: number;
	/**
	 * Distance from water level. (See https://prideout.net/blog/distance_fields/)
	 * 1, 2, ... - land cells
	 * -1, -2, ... - water cells
	 * 0 - unmarked cell
	 */
	t: number;
	/**
	 * Elevation in [0, 100] range, where 20 is the minimal land elevation.
	 */
	h: number;
	/**
	 * Cell temperature in Celsius.
	 */
	temp: number;
	/**
	 * Cell precipitation in unspecified scale.
	 * Higher number means more precipitation.
	 */
	prec: number;
}

export interface IJsonMap {
	info: IMapInfo;
	settings: IMapSettings;
	mapCoordinates: IMapCoordinates;
	pack: {
		cells: IPackCell[];
		vertices: IPackVertex[];
		features: IPackFeature[];
		cultures: (IWildCulture & Partial<ICulture>)[];
		burgs: IBurg[];
		states: (INeutralState & Partial<IState>)[];
		provinces: IProvince[];
		religions: (INoReligion & Partial<IReligion>)[];
		rivers: IRiver[];
		markers: IMarker[];
		routes: IRoute[];
	};
	/**
	 * Not very useful for markdown purposes.
	 * We can use Pack cells instead for most things except for temperature.
	 * Source: https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#basic-objects
	 */
	grid: {
		cells: IGridCell[];
		// Contains other info, but we don't care about it.
	};
	notes: INote;
	biomesData: IBiomesData;
}
