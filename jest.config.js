/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
		},
	},
};
