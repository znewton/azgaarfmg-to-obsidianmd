import type { Argv } from "yargs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import { convertMapToObsidianVault } from "./convert";

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
			"Convert a .map file to a Markdown workspace.",
			(y) =>
				y
					.option("map", {
						alias: "m",
						type: "string",
						description:
							"Path to the .map file, resolved from current working directory if relative.",
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
						"$0 -m ~/Downloads/MyMap.map -o ~/Documents/MyObsidianVault",
						"Creates a markdown files in ~/Documents/MyObsidianVault based on ~/Downloads/MyMap.map",
					),
			async (argv) => {
				const map = resolvePath(argv.map);
				const outDir = resolvePath(argv.outputDir);
				console.log("Converting Map file to Obsidian vault.", {
					mapFilePath: map,
					obsidianVaultPath: outDir,
				});
				return convertMapToObsidianVault(map, outDir);
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
