import type {
	IBiomesData,
	IBurg,
	ICulture,
	IGridCell,
	IJsonMap,
	IMarker,
	INameBase,
	INeutralState,
	INoReligion,
	INote,
	IPackCell,
	IProvince,
	IRegiment,
	IReligion,
	IRiver,
	IRoute,
	IState,
	IWildCulture,
} from "../definitions";

export function isValidWildCulture(obj: unknown): obj is IWildCulture {
	return (
		typeof obj === "object" &&
		typeof (obj as IWildCulture).i === "number" &&
		typeof (obj as IWildCulture).base === "number" &&
		typeof (obj as IWildCulture).name === "string" &&
		Array.isArray((obj as IWildCulture).origins) &&
		typeof (obj as IWildCulture).shield === "string"
	);
}
export function isValidCulture(obj: unknown): obj is ICulture {
	return (
		typeof obj === "object" &&
		typeof (obj as IWildCulture).i === "number" &&
		typeof (obj as IWildCulture).base === "number" &&
		typeof (obj as IWildCulture).name === "string" &&
		Array.isArray((obj as IWildCulture).origins) &&
		typeof (obj as IWildCulture).shield === "string" &&
		(obj as ICulture).origins.every((v) => typeof v === "number") &&
		typeof (obj as ICulture).center === "number" &&
		typeof (obj as ICulture).code === "string" &&
		typeof (obj as ICulture).color === "string" &&
		typeof (obj as ICulture).expansionism === "number" &&
		typeof (obj as ICulture).type === "string" &&
		(typeof (obj as ICulture).lock === "undefined" ||
			typeof (obj as ICulture).lock === "boolean") &&
		(typeof (obj as ICulture).removed === "undefined" ||
			typeof (obj as ICulture).removed === "boolean") &&
		typeof (obj as ICulture).area === "number" &&
		typeof (obj as ICulture).cells === "number" &&
		typeof (obj as ICulture).rural === "number" &&
		typeof (obj as ICulture).urban === "number"
	);
}
export function isValidBurg(obj: unknown): obj is IBurg {
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
export function isValidNeutralState(obj: unknown): obj is INeutralState {
	return (
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
		Array.isArray((obj as INeutralState).provinces)
	);
}
function isValidRegiment(obj: unknown): obj is IRegiment {
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
export function isValidState(obj: unknown): obj is IState {
	return (
		isValidNeutralState(obj) &&
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
		(obj as IState).military.every((v) => isValidRegiment(v)) &&
		typeof (obj as IState).coa === "object" &&
		((obj as IState).lock === undefined ||
			typeof (obj as IState).lock === "boolean") &&
		((obj as IState).removed === undefined ||
			typeof (obj as IState).removed === "boolean")
	);
}
export function isValidProvince(obj: unknown): obj is IProvince {
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
		Array.isArray((obj as IProvince).burgs) &&
		(obj as IProvince).burgs.every((v) => typeof v === "number") &&
		typeof (obj as IProvince).coa === "object" &&
		((obj as IProvince).lock === undefined ||
			typeof (obj as IProvince).lock === "boolean") &&
		((obj as IProvince).removed === undefined ||
			typeof (obj as IProvince).removed === "boolean") &&
		typeof (obj as IProvince).area === "number" &&
		typeof (obj as IProvince).rural === "number" &&
		typeof (obj as IProvince).urban === "number"
	);
}
export function isValidNoReligion(obj: unknown): obj is INoReligion {
	return (
		typeof obj === "object" &&
		typeof (obj as IReligion).i === "number" &&
		typeof (obj as IReligion).name === "string" &&
		(obj as IReligion).origins === null
	);
}
export function isValidReligion(obj: unknown): obj is IReligion {
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
		((obj as IReligion).origins === null ||
			(Array.isArray((obj as IReligion).origins) &&
				(obj as IReligion).origins?.every((v) => typeof v === "number") ===
					true)) &&
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
			typeof (obj as IReligion).removed === "boolean") &&
		typeof (obj as IReligion).area === "number" &&
		typeof (obj as IReligion).cells === "number" &&
		typeof (obj as IReligion).rural === "number" &&
		typeof (obj as IReligion).urban === "number"
	);
}
export function isValidRiver(obj: unknown): obj is IRiver {
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
export function isValidMarker(obj: unknown): obj is IMarker {
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
export function isValidRoute(obj: unknown): obj is IRoute {
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
export function isValidBiomesData(obj: unknown): obj is IBiomesData {
	return (
		typeof obj === "object" &&
		Array.isArray((obj as IBiomesData).i) &&
		(obj as IBiomesData).i.every((v) => typeof v === "number") &&
		Array.isArray((obj as IBiomesData).name) &&
		(obj as IBiomesData).name.every((v) => typeof v === "string") &&
		Array.isArray((obj as IBiomesData).color) &&
		(obj as IBiomesData).color.every((v) => typeof v === "string") &&
		Array.isArray((obj as IBiomesData).biomesMartix) &&
		(obj as IBiomesData).biomesMartix.every(
			(v) =>
				typeof v === "object" &&
				Object.entries(v).every(
					([k, vv]) =>
						typeof k === "string" &&
						Number.parseInt(k).toString() !== "NaN" &&
						typeof vv === "number",
				),
		) &&
		Array.isArray((obj as IBiomesData).cost) &&
		(obj as IBiomesData).cost.every((v) => typeof v === "number") &&
		Array.isArray((obj as IBiomesData).habitability) &&
		(obj as IBiomesData).habitability.every((v) => typeof v === "number") &&
		Array.isArray((obj as IBiomesData).icons) &&
		(obj as IBiomesData).icons.every(
			(v) => Array.isArray(v) && v.every((t) => typeof t === "string"),
		) &&
		Array.isArray((obj as IBiomesData).iconsDensity) &&
		(obj as IBiomesData).iconsDensity.every((v) => typeof v === "number")
	);
}
export function isValidNote(obj: unknown): obj is INote {
	return (
		typeof obj === "object" &&
		typeof (obj as INote).id === "string" &&
		typeof (obj as INote).legend === "string" &&
		typeof (obj as INote).name === "string"
	);
}
export function isValidNameBase(obj: unknown): obj is INameBase {
	return (
		typeof obj === "object" &&
		typeof (obj as INameBase).name === "string" &&
		// Technically, this can be undefined,
		// but it shouldn't be if user follows instructions.
		typeof (obj as INameBase).b === "string" &&
		typeof (obj as INameBase).min === "string" &&
		Number.parseInt((obj as INameBase).min).toString() !== "NaN" &&
		typeof (obj as INameBase).max === "string" &&
		Number.parseInt((obj as INameBase).max).toString() !== "NaN" &&
		typeof (obj as INameBase).d === "string" &&
		Number.parseFloat((obj as INameBase).m).toString() !== "NaN"
	);
}
export function isValidPackCell(obj: unknown): obj is IPackCell {
	return (
		typeof obj === "object" &&
		typeof (obj as IPackCell).i === "number" &&
		Array.isArray((obj as IPackCell).v) &&
		(obj as IPackCell).v.every((v) => typeof v === "number") &&
		Array.isArray((obj as IPackCell).c) &&
		(obj as IPackCell).c.every((v) => typeof v === "number") &&
		Array.isArray((obj as IPackCell).p) &&
		(obj as IPackCell).p.every((v) => typeof v === "number") &&
		(obj as IPackCell).p.length === 2 &&
		typeof (obj as IPackCell).g === "number" &&
		typeof (obj as IPackCell).h === "number" &&
		typeof (obj as IPackCell).f === "number" &&
		typeof (obj as IPackCell).t === "number" &&
		typeof (obj as IPackCell).r === "number" &&
		typeof (obj as IPackCell).fl === "number" &&
		typeof (obj as IPackCell).s === "number" &&
		typeof (obj as IPackCell).area === "number" &&
		typeof (obj as IPackCell).haven === "number" &&
		typeof (obj as IPackCell).harbor === "number" &&
		typeof (obj as IPackCell).conf === "number" &&
		typeof (obj as IPackCell).biome === "number" &&
		typeof (obj as IPackCell).pop === "number" &&
		typeof (obj as IPackCell).culture === "number" &&
		typeof (obj as IPackCell).burg === "number" &&
		typeof (obj as IPackCell).state === "number" &&
		typeof (obj as IPackCell).religion === "number" &&
		typeof (obj as IPackCell).province === "number"
	);
}
export function isValidGridCell(obj: unknown): obj is IGridCell {
	return (
		typeof obj === "object" &&
		typeof (obj as IGridCell).i === "number" &&
		Array.isArray((obj as IPackCell).v) &&
		(obj as IPackCell).v.every((v) => typeof v === "number") &&
		Array.isArray((obj as IPackCell).c) &&
		(obj as IPackCell).c.every((v) => typeof v === "number") &&
		typeof (obj as IGridCell).b === "number" &&
		typeof (obj as IGridCell).f === "number" &&
		typeof (obj as IGridCell).t === "number" &&
		typeof (obj as IGridCell).h === "number" &&
		typeof (obj as IGridCell).temp === "number" &&
		typeof (obj as IGridCell).prec === "number"
	);
}

/**
 * Validates whether input map is the expected shape.
 *
 * Any inconsistencies will be logged as warnings, but it will not throw.
 * This is useful for users to be able to debug the map in one go.
 *
 * @param map - JSON map input
 */
export function isValidJsonMap(map: unknown): map is IJsonMap {
	let isValid = true;
	// A couple hard checks first because otherwise the rest is pointless.
	if (typeof map !== "object") {
		console.error("Cannot parse non-JSON Object map");
		return false;
	}
	if (typeof (map as IJsonMap).pack !== "object") {
		console.error("Cannot parse non-object pack property");
		return false;
	}
	// Cultures
	const cultures = (map as IJsonMap).pack.cultures;
	if (Array.isArray(cultures)) {
		if (!isValidWildCulture(cultures[0])) {
			console.warn("Expected 'Wild' Culture at 0 index", cultures[0]);
			isValid = false;
		}
		for (const culture of cultures.slice(1)) {
			if (!isValidCulture(culture)) {
				console.warn("Encountered invalid Culture", culture);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's cultures list was not an Array", cultures);
		isValid = false;
	}

	// Burgs
	const burgs = (map as IJsonMap).pack.burgs;
	if (Array.isArray(burgs)) {
		if (isValidBurg(burgs[0])) {
			console.warn("Expected invalid first Burg at 0 index", burgs[0]);
			isValid = false;
		}
		for (const burg of burgs.slice(1)) {
			if (!isValidBurg(burg)) {
				console.warn("Encountered invalid Burg", burg);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's burgs list was not an Array", burgs);
		isValid = false;
	}

	// States
	const states = (map as IJsonMap).pack.states;
	if (Array.isArray(states)) {
		if (!isValidNeutralState(states[0])) {
			console.warn("Expected neutral state at 0 index", states[0]);
			isValid = false;
		}
		for (const state of states.slice(1)) {
			if (!isValidState(state)) {
				console.warn("Encountered invalid State", state);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's states list was not an Array", states);
		isValid = false;
	}

	// Provinces
	const provinces = (map as IJsonMap).pack.provinces;
	if (Array.isArray(provinces)) {
		if (isValidProvince(provinces[0])) {
			console.warn("Expected invalid province at 0 index", provinces[0]);
			isValid = false;
		}
		for (const province of provinces.slice(1)) {
			if (!isValidProvince(province)) {
				console.warn("Encountered invalid Province", province);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's provinces list was not an Array", provinces);
		isValid = false;
	}

	// Religions
	const religions = (map as IJsonMap).pack.religions;
	if (Array.isArray(religions)) {
		if (!isValidNoReligion(religions[0])) {
			console.warn("Expected non-religion at 0 index", religions[0]);
			isValid = false;
		}
		for (const religion of religions.slice(1)) {
			if (!isValidReligion(religion)) {
				console.warn("Encountered invalid Religion", religion);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's religions list was not an Array", religions);
		isValid = false;
	}

	// Rivers
	const rivers = (map as IJsonMap).pack.rivers;
	if (Array.isArray(rivers)) {
		for (const river of rivers) {
			if (!isValidRiver(river)) {
				console.warn("Encountered invalid River", river);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's rivers list was not an Array", rivers);
		isValid = false;
	}

	// Markers
	const markers = (map as IJsonMap).pack.markers;
	if (Array.isArray(markers)) {
		for (const marker of markers) {
			if (!isValidMarker(marker)) {
				console.warn("Encountered invalid Marker", marker);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's markers list was not an Array", markers);
		isValid = false;
	}

	// Routes
	const routes = (map as IJsonMap).pack.routes;
	if (Array.isArray(routes)) {
		for (const route of routes) {
			if (!isValidRoute(route)) {
				console.warn("Encountered invalid Route", route);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's routes list was not an Array", routes);
		isValid = false;
	}

	// Notes
	const notes = (map as IJsonMap).notes;
	if (Array.isArray(notes)) {
		for (const note of notes) {
			if (!isValidNote(note)) {
				console.warn("Encountered invalid Note", note);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's notes list was not an Array", notes);
		isValid = false;
	}

	// NameBases
	const nameBases = (map as IJsonMap).nameBases;
	if (Array.isArray(nameBases)) {
		for (const nameBase of nameBases) {
			if (!isValidNameBase(nameBase)) {
				console.warn("Encountered invalid NameBase", nameBase);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's nameBases list was not an Array", nameBases);
		isValid = false;
	}

	// PackCells
	const packCells = (map as IJsonMap).pack.cells;
	if (Array.isArray(packCells)) {
		for (const packCell of packCells) {
			if (!isValidPackCell(packCell)) {
				console.warn("Encountered invalid PackCell", packCell);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's pack.cells list was not an Array", packCells);
		isValid = false;
	}

	// GridCells
	const gridCells = (map as IJsonMap).grid.cells;
	if (Array.isArray(gridCells)) {
		for (const gridCell of gridCells) {
			if (!isValidGridCell(gridCell)) {
				console.warn("Encountered invalid GridCell", gridCell);
				isValid = false;
			}
		}
	} else {
		console.error("Input map's grid.cells list was not an Array", gridCells);
		isValid = false;
	}

	// BiomesData
	const biomesData = (map as IJsonMap).biomesData;
	if (!isValidBiomesData(biomesData)) {
		console.warn("Encountered invalid biomesData", biomesData);
	}

	return isValid;
}
