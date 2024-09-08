import fs from "node:fs/promises";
import path from "node:path";
import type { IJsonMapEx } from "./definitions";
import { CustomContentString, type IMarkdownNote } from "./markdown";
import { getExistingFileCustomContents, insertCustomContents } from "./utils";
import type { IVaultPath, IVaultDirectory } from "./vault";

/**
 * Creates a dataview function call for a more readable format for large numbers.
 */
function getLargeNumFormatFn(field: string): string {
	return `regexreplace(string(${field}), "[0-9](?=(?:[0-9]{3})+(?![0-9]))", "$& ")`;
}

async function writeDataviewPageToFile<T>(
	contents: string,
	vaultPath: IVaultPath,
): Promise<void> {
	const filePath = path.join(vaultPath.absolute, `${vaultPath.name}.md`);
	const existingCustomContents = await getExistingFileCustomContents(filePath);
	const backwardsCompatibleContents = insertCustomContents(
		existingCustomContents,
		contents,
	);
	await fs.writeFile(filePath, backwardsCompatibleContents);
}

function buildDataviewMd(title: string, query: string): string {
	return `---
tags:
- dataview
---

# ${title}

\`\`\`dataview
${query}
\`\`\`

${CustomContentString}
`;
}

const culturesDataviewPage = buildDataviewMd(
	"Cultures",
	`TABLE species as "Species", ${getLargeNumFormatFn("area")} AS "Area (Mi<sup>2</sup>)", ${getLargeNumFormatFn("totalPopulation")}  AS "Population"
FROM #culture 
SORT totalPopulation DESC`,
);

const burgsDataviewPage = buildDataviewMd(
	"Burgs",
	`TABLE ${getLargeNumFormatFn("population")} AS "Population", temperature AS "Temperature", culture AS "Culture", religion AS "Religion", state AS "State", province AS "Province"
FROM #burg
SORT state, population ASC`,
);

const markersDataviewPage = buildDataviewMd(
	"Points Of Interest (Markers)",
	`TABLE type AS "Type", nearbyBurg AS "Nearby Burg", province AS "Province", state AS "State", culture AS "Culture", religion AS "Religion"
FROM #marker
SORT type ASC`,
);

const routesDataviewPage = buildDataviewMd(
	"Routes",
	`TABLE group AS "Group", length AS "Length", numBurgsPassedBy AS "# Burgs Passed", numMarkersPassedBy AS "# Markers Passed"
FROM #route 
SORT lengthNum DESC`,
);

const statesDataviewPage = buildDataviewMd(
	"States",
	`TABLE form AS "Form", ${getLargeNumFormatFn("area")} AS "Area (Mi<sup>2</sup>)", ${getLargeNumFormatFn("totalPopulation")}  AS "Population", culture as "Culture"
FROM #state
SORT area DESC`,
);

const provincesDataviewPage = buildDataviewMd(
	"Provinces",
	`TABLE form AS "Form", ${getLargeNumFormatFn("area")} AS "Area (Mi<sup>2</sup>)", ${getLargeNumFormatFn("totalPopulation")}  AS "Population"
FROM #province
SORT area DESC`,
);

const religionsDataviewPage = buildDataviewMd(
	"Religions",
	`TABLE form AS "Form", deity AS "Deity", ${getLargeNumFormatFn("area")} AS "Area (Mi<sup>2</sup>)", ${getLargeNumFormatFn("totalPopulation")}  AS "Population
FROM #religion
SORT deity, population DESC`,
);

const biomesDataviewPage = buildDataviewMd(
	"Biomes",
	`TABLE habitability AS "Habitability"
FROM #biome
SORT habitabilityScore ASC`,
);

const riversDataviewPage = buildDataviewMd(
	"Rivers",
	`TABLE type AS "Type", lengthStr AS "Length, flowRate AS "Flow m<sup>3</sup>/s", basin AS "Basin", parent AS "Parent"
FROM #river
SORT length ASC`,
);

export async function createDataviewPages(vault: IVaultDirectory) {
	const dataViewWritePs: Promise<void>[] = [
		writeDataviewPageToFile(culturesDataviewPage, vault.cultures),
		writeDataviewPageToFile(burgsDataviewPage, vault.burgs),
		writeDataviewPageToFile(markersDataviewPage, vault.poi),
		writeDataviewPageToFile(routesDataviewPage, vault.routes),
		writeDataviewPageToFile(statesDataviewPage, vault.states),
		writeDataviewPageToFile(provincesDataviewPage, vault.provinces),
		writeDataviewPageToFile(religionsDataviewPage, vault.religions),
		writeDataviewPageToFile(biomesDataviewPage, vault.biomes),
		writeDataviewPageToFile(riversDataviewPage, vault.rivers),
	];

	await Promise.allSettled(dataViewWritePs);
}
