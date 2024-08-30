/**
 * Round v to decimal places d
 * @param v - Number to round
 * @param d - decimal places
 */
export const round = (v: number, d = 0) => {
	const m = 10 ** d;
	return Math.round(v * m) / m;
};
export const minmax = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);
export const normalize = (val: number, min: number, max: number) =>
	minmax((val - min) / (max - min), 0, 1);
/**
 * Iterating over a list of indices i, 1 of every n will return true.
 */
export const each = (n: number) => (i: number) => i % n === 0;
