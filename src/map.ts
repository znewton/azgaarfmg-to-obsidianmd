import type {
	IBiome,
	IBurg,
	IMap,
	IMapMetadata,
	IMarker,
	INameBase,
	INeutralState,
	INoReligion,
	INote,
	IProvince,
	IRawCulture,
	IRawMap,
	IRawProvince,
	IRawReligion,
	IRegiment,
	IReligion,
	IRiver,
	IRoute,
	IState,
	IWildCulture,
} from "./definitions";

const CompatibleMapVersions = ["1.99"];
function isCompatible(fileVersion: string): boolean {
	return CompatibleMapVersions.includes(
		fileVersion.split(".").slice(0, 2).join("."),
	);
}

export function isIWildCulture(obj: unknown): obj is IWildCulture {
	return (
		typeof obj === "object" &&
		typeof (obj as IWildCulture).i === "number" &&
		typeof (obj as IWildCulture).base === "number" &&
		typeof (obj as IWildCulture).name === "string" &&
		Array.isArray((obj as IWildCulture).origins) &&
		typeof (obj as IWildCulture).shield === "string"
	);
}

export function isIRawCulture(obj: unknown): obj is IRawCulture {
	return (
		typeof obj === "object" &&
		typeof (obj as IWildCulture).i === "number" &&
		typeof (obj as IWildCulture).base === "number" &&
		typeof (obj as IWildCulture).name === "string" &&
		Array.isArray((obj as IWildCulture).origins) &&
		typeof (obj as IWildCulture).shield === "string" &&
		(obj as IRawCulture).origins.every((v) => typeof v === "number") &&
		typeof (obj as IRawCulture).center === "number" &&
		typeof (obj as IRawCulture).code === "string" &&
		typeof (obj as IRawCulture).color === "string" &&
		typeof (obj as IRawCulture).expansionism === "number" &&
		typeof (obj as IRawCulture).type === "string" &&
		(typeof (obj as IRawCulture).lock === "undefined" ||
			typeof (obj as IRawCulture).lock === "boolean") &&
		(typeof (obj as IRawCulture).removed === "undefined" ||
			typeof (obj as IRawCulture).removed === "boolean")
	);
}

export function isIBurg(obj: unknown): obj is IBurg {
	return (
		typeof obj === "object" &&
		typeof (obj as IBurg).i === "number" &&
		typeof (obj as IBurg).name === "string" &&
		typeof (obj as IBurg).cell === "number" &&
		typeof (obj as IBurg).x === "number" &&
		typeof (obj as IBurg).y === "number" &&
		typeof (obj as IBurg).culture === "number" &&
		typeof (obj as IBurg).state === "number" &&
		typeof (obj as IBurg).feature === "number" &&
		typeof (obj as IBurg).population === "number" &&
		typeof (obj as IBurg).type === "string" &&
		typeof (obj as IBurg).coa === "object" &&
		((obj as IBurg).MFCG === undefined ||
			typeof (obj as IBurg).MFCG === "number") &&
		((obj as IBurg).link === undefined ||
			typeof (obj as IBurg).link === "string") &&
		typeof (obj as IBurg).capital === "number" &&
		typeof (obj as IBurg).port === "number" &&
		typeof (obj as IBurg).citadel === "number" &&
		typeof (obj as IBurg).plaza === "number" &&
		typeof (obj as IBurg).shanty === "number" &&
		typeof (obj as IBurg).temple === "number" &&
		typeof (obj as IBurg).walls === "number" &&
		((obj as IBurg).lock === undefined ||
			typeof (obj as IBurg).lock === "boolean") &&
		((obj as IBurg).removed === undefined ||
			typeof (obj as IBurg).removed === "boolean")
	);
}

export function isIState(obj: unknown): obj is IState | INeutralState {
	const satisfiesNeutralState =
		typeof obj === "object" &&
		typeof (obj as INeutralState).i === "number" &&
		typeof (obj as INeutralState).name === "string" &&
		typeof (obj as INeutralState).urban === "number" &&
		typeof (obj as INeutralState).rural === "number" &&
		typeof (obj as INeutralState).burgs === "number" &&
		typeof (obj as INeutralState).area === "number" &&
		typeof (obj as INeutralState).cells === "number" &&
		Array.isArray((obj as INeutralState).neighbors) &&
		Array.isArray((obj as INeutralState).diplomacy) &&
		Array.isArray((obj as INeutralState).provinces);
	if (!satisfiesNeutralState) return false;
	if ((obj as INeutralState).i === 0) {
		return satisfiesNeutralState;
	}
	return (
		typeof (obj as IState).form === "string" &&
		typeof (obj as IState).formName === "string" &&
		typeof (obj as IState).fullName === "string" &&
		typeof (obj as IState).color === "string" &&
		typeof (obj as IState).center === "number" &&
		Array.isArray((obj as IState).pole) &&
		(obj as IState).pole.every((v) => typeof v === "number") &&
		((obj as IState).capital === undefined ||
			typeof (obj as IState).capital === "number") &&
		typeof (obj as IState).culture === "number" &&
		typeof (obj as IState).type === "string" &&
		typeof (obj as IState).expansionism === "number" &&
		Array.isArray((obj as IState).campaigns) &&
		(obj as IState).campaigns.every((v) => typeof v === "object") &&
		(obj as IState).neighbors.every((v) => typeof v === "number") &&
		(obj as IState).diplomacy.every((v) => typeof v === "string") &&
		(obj as IState).provinces.every((v) => typeof v === "number") &&
		typeof (obj as IState).alert === "number" &&
		Array.isArray((obj as IState).military) &&
		(obj as IState).military.every((v) => isIRegiment(v)) &&
		typeof (obj as IState).coa === "object" &&
		((obj as IState).lock === undefined ||
			typeof (obj as IState).lock === "boolean") &&
		((obj as IState).removed === undefined ||
			typeof (obj as IState).removed === "boolean")
	);
}

export function isIRegiment(obj: unknown): obj is IRegiment {
	return (
		typeof obj === "object" &&
		typeof (obj as IRegiment).i === "number" &&
		typeof (obj as IRegiment).x === "number" &&
		typeof (obj as IRegiment).y === "number" &&
		typeof (obj as IRegiment).bx === "number" &&
		typeof (obj as IRegiment).by === "number" &&
		typeof (obj as IRegiment).a === "number" &&
		typeof (obj as IRegiment).icon === "string" &&
		typeof (obj as IRegiment).cell === "number" &&
		typeof (obj as IRegiment).state === "number" &&
		typeof (obj as IRegiment).name === "string" &&
		typeof (obj as IRegiment).n === "number" &&
		typeof (obj as IRegiment).u === "object"
	);
}

export function isIRawProvince(obj: unknown): obj is IRawProvince {
	return (
		typeof obj === "object" &&
		typeof (obj as IProvince).i === "number" &&
		typeof (obj as IProvince).name === "string" &&
		typeof (obj as IProvince).formName === "string" &&
		typeof (obj as IProvince).fullName === "string" &&
		typeof (obj as IProvince).color === "string" &&
		typeof (obj as IProvince).center === "number" &&
		Array.isArray((obj as IProvince).pole) &&
		(obj as IProvince).pole.every((v) => typeof v === "number") &&
		typeof (obj as IProvince).burg === "number" &&
		((obj as IProvince).burgs === undefined ||
			(Array.isArray((obj as IProvince).burgs) &&
				(obj as IProvince).burgs?.every((v) => typeof v === "number") ===
					true)) &&
		typeof (obj as IProvince).coa === "object" &&
		((obj as IProvince).lock === undefined ||
			typeof (obj as IProvince).lock === "boolean") &&
		((obj as IProvince).removed === undefined ||
			typeof (obj as IProvince).removed === "boolean")
	);
}

export function isINoReligion(obj: unknown): obj is INoReligion {
	return (
		typeof obj === "object" &&
		typeof (obj as IReligion).i === "number" &&
		typeof (obj as IReligion).name === "string" &&
		(obj as IReligion).origins === null
	);
}

export function isIRawReligion(obj: unknown): obj is IRawReligion {
	return (
		typeof obj === "object" &&
		typeof (obj as IReligion).i === "number" &&
		typeof (obj as IReligion).name === "string" &&
		typeof (obj as IReligion).type === "string" &&
		typeof (obj as IReligion).form === "string" &&
		((obj as IReligion).deity === null ||
			typeof (obj as IReligion).deity === "string") &&
		typeof (obj as IReligion).color === "string" &&
		typeof (obj as IReligion).code === "string" &&
		Array.isArray((obj as IReligion).origins) &&
		(obj as IReligion).origins.every((v) => typeof v === "number") &&
		typeof (obj as IReligion).center === "number" &&
		typeof (obj as IReligion).culture === "number" &&
		((obj as IReligion).pole === undefined ||
			(Array.isArray((obj as IReligion).pole) &&
				(obj as IReligion).pole?.every((v) => typeof v === "number")) ===
				true) &&
		typeof (obj as IReligion).expansionism === "number" &&
		typeof (obj as IReligion).expansion === "string" &&
		((obj as IReligion).lock === undefined ||
			typeof (obj as IReligion).lock === "boolean") &&
		((obj as IReligion).removed === undefined ||
			typeof (obj as IReligion).removed === "boolean")
	);
}

export function isIRiver(obj: unknown): obj is IRiver {
	return (
		typeof obj === "object" &&
		typeof (obj as IRiver).i === "number" &&
		typeof (obj as IRiver).name === "string" &&
		typeof (obj as IRiver).type === "string" &&
		typeof (obj as IRiver).source === "number" &&
		typeof (obj as IRiver).mouth === "number" &&
		typeof (obj as IRiver).parent === "number" &&
		typeof (obj as IRiver).basin === "number" &&
		Array.isArray((obj as IRiver).cells) &&
		(obj as IRiver).cells.every((v) => typeof v === "number") &&
		((obj as IRiver).points === undefined ||
			(Array.isArray((obj as IRiver).points) &&
				(obj as IRiver).points?.every(
					(v) => Array.isArray(v) && v.every((t) => typeof t === "number"),
				) === true)) &&
		typeof (obj as IRiver).discharge === "number" &&
		typeof (obj as IRiver).length === "number" &&
		typeof (obj as IRiver).width === "number" &&
		typeof (obj as IRiver).sourceWidth === "number"
	);
}

export function isIMarker(obj: unknown): obj is IMarker {
	return (
		typeof obj === "object" &&
		typeof (obj as IMarker).i === "number" &&
		typeof (obj as IMarker).icon === "string" &&
		typeof (obj as IMarker).x === "number" &&
		typeof (obj as IMarker).y === "number" &&
		typeof (obj as IMarker).cell === "number" &&
		((obj as IMarker).type === undefined ||
			typeof (obj as IMarker).type === "string") &&
		((obj as IMarker).size === undefined ||
			typeof (obj as IMarker).size === "number") &&
		((obj as IMarker).fill === undefined ||
			typeof (obj as IMarker).fill === "string") &&
		((obj as IMarker).stroke === undefined ||
			typeof (obj as IMarker).stroke === "string") &&
		((obj as IMarker).pin === undefined ||
			typeof (obj as IMarker).pin === "string") &&
		((obj as IMarker).pinned === undefined ||
			typeof (obj as IMarker).pinned === "boolean") &&
		((obj as IMarker).dx === undefined ||
			typeof (obj as IMarker).dx === "number") &&
		((obj as IMarker).dy === undefined ||
			typeof (obj as IMarker).dy === "number") &&
		((obj as IMarker).px === undefined ||
			typeof (obj as IMarker).px === "number") &&
		((obj as IMarker).lock === undefined ||
			typeof (obj as IMarker).lock === "boolean")
	);
}

export function isIRoute(obj: unknown): obj is IRoute {
	return (
		typeof obj === "object" &&
		typeof (obj as IRoute).i === "number" &&
		Array.isArray((obj as IRoute).points) &&
		(obj as IRoute).points.every(
			(v) =>
				Array.isArray(v) &&
				v.every((t) => typeof t === "number") &&
				v.length === 3,
		) &&
		typeof (obj as IRoute).feature === "number" &&
		typeof (obj as IRoute).group === "string" &&
		((obj as IRoute).length === undefined ||
			typeof (obj as IRoute).length === "number") &&
		((obj as IRoute).name === undefined ||
			typeof (obj as IRoute).name === "string") &&
		((obj as IRoute).lock === undefined ||
			typeof (obj as IRoute).lock === "boolean")
	);
}

export function isIBiome(obj: unknown): obj is IBiome {
	throw new Error("Not Implemented");
}

export function isINote(obj: unknown): obj is INote {
	return (
		typeof obj === "object" &&
		typeof (obj as INote).id === "string" &&
		typeof (obj as INote).legend === "string" &&
		typeof (obj as INote).name === "string"
	);
}

export function isINameBase(obj: unknown): obj is INameBase {
	throw new Error("Not Implemented");
}

export function getMapMetadata(rawMapFile: string): IMapMetadata {
	const rawLines: string[] = rawMapFile.split("\n");
	const [
		rawVersion,
		rawTip,
		rawCreateTime,
		rawSeed,
		rawWidth,
		rawHeight,
		rawId,
	]: string[] = rawLines[0].split("|");
	const [
		rawDistanceUnit,
		rawDistanceScale,
		rawAreaUnit,
		rawHeightUnit,
		rawHeightExponentInput,
		rawTemperatureUnit,
		,
		,
		,
		,
		,
		,
		rawPopulationRate,
		rawUrbanization,
		rawMapSizeOutput,
		rawLatitudeOutput,
		,
		,
		rawPrecipitationOutput,
		_settings,
		rawName,
		rawHideLabels,
		rawStylePreset,
		rawRescaleLabels,
		rawUrbanDensity,
		rawLongitudeOutput,
	]: string[] = rawLines[1].split("|");
	const { latT, latN, latS, lonT, lonW, lonE } = JSON.parse(rawLines[2]);
	const [
		_rawBiomesColorsList,
		_rawBiomesHabitabilityList,
		rawBiomesList,
	]: string[] = rawLines[3].split("|");
	return {
		version: rawVersion,
		tip: rawTip,
		createdTimestamp: new Date(rawCreateTime).getTime(),
		seed: Number.parseInt(rawSeed),
		width: Number.parseInt(rawWidth),
		height: Number.parseInt(rawHeight),
		id: Number.parseInt(rawId),
		distanceUnit: rawDistanceUnit,
		distanceScale: Number.parseInt(rawDistanceScale),
		areaUnit: rawAreaUnit,
		heightUnit: rawHeightUnit,
		temperatureUnit: rawTemperatureUnit,
		worldName: rawName,
		totalLatitude: latT,
		totalLongitude: lonT,
		latitudeNorth: latN,
		latitudeSouth: latS,
		longitudeWest: lonW,
		longitudeEast: lonE,
		biomes: rawBiomesList.split(","),
	};
}

/**
 * Parse a raw .map file into a usable JS object.
 *
 * @param rawMapFile - String representing file contents of FMG .map file
 * @returns information from the .map file in a more usable {@link IRawMap} format
 */
export function parseMapFile(rawMapFile: string): IRawMap {
	const metadata = getMapMetadata(rawMapFile);
	const rawLines: string[] = rawMapFile.split("\n");
	if (!isCompatible(metadata.version)) {
		throw new Error(
			`Incompatible Map Version. Supported: ${CompatibleMapVersions}; Received: ${metadata.version}`,
		);
	}
	const jsonLines: unknown[] = [];
	const unknownLines: unknown[] = [];
	for (const rawLine of rawLines) {
		try {
			const jsonLine: unknown = JSON.parse(rawLine);
			jsonLines.push(jsonLine);
		} catch (e) {
			unknownLines.push(e);
			// Ignore. There are lines that are not JSON (e.g. HTML and vectors)
		}
	}
	console.log(`Found ${jsonLines.length} lines of JSON in map file.`);
	console.log(
		`Found ${unknownLines.length} lines of Unknown info in map file.`,
	);
	const map: IRawMap = {
		metadata,
		cultures: [],
		burgs: [],
		states: [],
		regiments: [],
		provinces: [],
		religions: [],
		rivers: [],
		markers: [],
		routes: [],
		biomes: [],
		notes: [],
		nameBases: [],
	};

	for (const jsonLine of jsonLines) {
		if (!Array.isArray(jsonLine)) {
			continue;
		}
		// In reality, every object in a given line's array is
		// of one type, but rather than doing something complicated
		// to track those types separately, we can just push each type-checked
		// object to its appropriate IMap property.
		for (const obj of jsonLine as unknown[]) {
			if (isIRawCulture(obj) || isIWildCulture(obj)) {
				map.cultures.push(obj);
			} else if (isIBurg(obj)) {
				map.burgs.push(obj);
			} else if (isIState(obj)) {
				map.states.push(obj);
				// map.regiments.push(...((obj as IState).military ?? []));
			} else if (isIRawProvince(obj)) {
				map.provinces.push(obj);
			} else if (isIRawReligion(obj) || isINoReligion(obj)) {
				map.religions.push(obj);
			} else if (isIRiver(obj)) {
				map.rivers.push(obj);
			} else if (isIMarker(obj)) {
				map.markers.push(obj);
			} else if (isIRoute(obj)) {
				map.routes.push(obj);
			} else if (isINote(obj)) {
				map.notes.push(obj);
			}
		}
	}

	return map;
}

/**
 * Returns full map data with computed information.
 * @param rawMap - raw data parsed from .map file
 */
export function computeFullMapFromRawMap(rawMap: IRawMap): IMap {
	const map: IMap = {
		metadata: rawMap.metadata,
		cultures: [],
		burgs: [...rawMap.burgs],
		states: [...rawMap.states],
		regiments: [...rawMap.regiments],
		provinces: [],
		religions: [],
		rivers: [...rawMap.rivers],
		markers: [...rawMap.markers],
		routes: [...rawMap.routes],
		biomes: [...rawMap.biomes],
		notes: [...rawMap.notes],
		nameBases: [...rawMap.nameBases],
	};

	for (const rawReligion of rawMap.religions) {
	}
	return map;
}
