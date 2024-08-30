import { describe, expect, test } from "@jest/globals";
import path from "node:path";
import { burgToMd, cultureToMd } from "../convert";
import { CustomContentString } from "../markdown";
import { type IPath, type IVaultDirectory, worldDirectoryName } from "../vault";
import type { IBurg, ICulture, IJsonMap, IJsonMapEx } from "../definitions";
import { buildBiomes } from "../map";
import koberzarJson from "./example/koberzar.json";

describe("convert map objects to markdown", () => {
	const exampleMap: IJsonMapEx = {
		...(koberzarJson as unknown as IJsonMap),
		biomes: buildBiomes(koberzarJson as unknown as IJsonMap),
	};
	const exampleVaultRootDir = "/testVault";
	const createMockVaultPath = (name: string): IPath => ({
		absolute: path.resolve(exampleVaultRootDir, name),
		relative: path.relative(exampleVaultRootDir, name),
	});
	const exampleVaultWorldPath = createMockVaultPath(worldDirectoryName);
	const exampleVault: IVaultDirectory = {
		root: {
			absolute: exampleVaultRootDir,
			relative: path.relative(exampleVaultRootDir, exampleVaultRootDir),
		},
		world: exampleVaultWorldPath,
		cultures: createMockVaultPath("cultures"),
		biomes: createMockVaultPath("biomes"),
		burgs: createMockVaultPath("burgs"),
		nameBases: createMockVaultPath("nameBases"),
		provinces: createMockVaultPath("provinces"),
		states: createMockVaultPath("states"),
		religions: createMockVaultPath("religions"),
		rivers: createMockVaultPath("rivers"),
		routes: createMockVaultPath("routes"),
		poi: createMockVaultPath("poi"),
	};
	describe("cultureToMd()", () => {
		test("includes custom content section", () => {
			const example = exampleMap.pack.cultures[1] as ICulture;
			const { contents } = cultureToMd(example, exampleMap, exampleVault);
			expect(contents).toMatch(CustomContentString);
		});
	});
	describe("burgToMd()", () => {
		test("includes custom content section", () => {
			const example = exampleMap.pack.burgs[1] as IBurg;
			const { contents } = burgToMd(example, exampleMap, exampleVault);
			expect(contents).toMatch(CustomContentString);
		});
	});
});
