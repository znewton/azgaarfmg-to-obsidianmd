function parseCSVValue(value: string): string | number {
	if (Number.parseFloat(value).toString() !== "NaN") {
		return Number.parseFloat(value);
	}
	return value;
}
export function parseCSV(csvFile: string): Record<string, number | string>[] {
	const csvLines = csvFile.split("\n");
	const results: Record<string, string | number>[] = [];
	const keys = csvLines[0].split(",");
	for (const row of csvLines.slice(1)) {
		const values = row.split(",");
		if (keys.length !== values.length) {
			throw new Error(
				`Invalid row/header column length. values columns: ${values.length}, headers columns: ${keys.length}`,
			);
		}
		const result: Record<string, string | number> = {};
		for (const [index, key] of keys.entries()) {
			const value = values[index];
			result[key] = parseCSVValue(value);
		}
		results.push(result);
	}
	return results;
}
