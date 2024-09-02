import type { Argv } from "yargs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import { convertMapToObsidianVault } from "./conversions";

function resolvePath(filepath: string): string {
	if (filepath[0] === "~") {
		if (!process.env.HOME) {
			throw new Error(
				"Could not resolve ~ in filepath. process.env.HOME does not exist.",
			);
		}
		return path.resolve(process.env.HOME, filepath.slice(1));
	}
	return path.resolve(filepath);
}

(async function main() {
	await yargs(hideBin(process.argv))
		.scriptName("fmg-to-omd")
		.usage("$0 <cmd> [args]")
		.showHelpOnFail(false)
		.command(
			"convert",
			"Convert a .json file to a Markdown workspace.",
			(y) =>
				y
					.option("json", {
						alias: "j",
						type: "string",
						description:
							"Path to the .json file, resolved from current working directory if relative.",
						demandOption: true,
					})
					.option("map", {
						alias: "m",
						type: "string",
						description:
							"Path to the .map file, resolved from current working directory if relative.",
						demandOption: true,
					})
					.option("img", {
						alias: "i",
						type: "string",
						description:
							"Path to the .svg file, resolved from current working directory if relative.",
						demandOption: true,
					})
					.option("outputDir", {
						alias: "o",
						type: "string",
						description:
							"Path to the obsidian vault directory, resolved from current working directory if relative.",
						demandOption: true,
					})
					.example(
						"$0 -m ~/Downloads/MyMap.json -o ~/Documents/MyObsidianVault",
						"Creates a markdown files in ~/Documents/MyObsidianVault based on ~/Downloads/MyMap.json",
					),
			async (argv) => {
				const json = resolvePath(argv.json);
				const map = resolvePath(argv.map);
				const img = resolvePath(argv.img);
				const outDir = resolvePath(argv.outputDir);
				console.log("Converting Map file to Obsidian vault.", {
					jsonFilePath: json,
					mapFilePath: map,
					mapImagePath: img,
					obsidianVaultPath: outDir,
				});
				return convertMapToObsidianVault(json, map, img, outDir);
			},
		)
		.demandCommand()
		.parseAsync();
})()
	.then(() => {
		console.info("Done!");
		process.exit(0);
	})
	.catch((error: unknown) => {
		console.error("Failed.", error);
		process.exit(1);
	});
