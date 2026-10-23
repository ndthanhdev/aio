// @ts-check

import eslint from "@eslint/js";
import eslintJsonc from "eslint-plugin-jsonc";
import eslintPerfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginYml from "eslint-plugin-yml";
import tsEslint from "typescript-eslint";

const Constants = {
	abbreviations: {
		dev: false,
		dir: false,
		dirs: false,
		env: false,
		envs: false,
		prod: false,
		prop: false,
		props: false,
		stg: false,
	},
	ignoreFiles: [
		"**/?(.)cache/",
		"**/public/",
		"**/dist/",
		"**/target/",
		".yarn/",
		"node_modules/",
		".agents/",
		"skills/",
		"apps/recorder/assets/sw.js",
		"apps/site/src/gatsby-types.d.ts",
	],
	jsConfigFiles: ["eslint.config.js"],
	jsoncFiles: ["**/*.json?(c)"],
	tsEslintFiles: ["**/*.?(c|m)@(j|t)s?(x)"],
	ymlFiles: ["**/*.y?(a)ml"],
};

/**
 * @param {(string[] | undefined)} files
 * @param {string[]} [ignores]
 * @returns {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigArray}
 */
const withFiles = (configs, files, ignores = []) => {
	return configs.map((config) => ({
		...config,
		files,
		ignores,
	}));
};

/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
export default tsEslint.config(
	{
		ignores: Constants.ignoreFiles,
	},
	eslint.configs.recommended,
	...withFiles(tsEslint.configs.stylistic, Constants.tsEslintFiles),
	...withFiles(
		tsEslint.configs.strictTypeChecked,
		Constants.tsEslintFiles,
		Constants.jsConfigFiles,
	),
	eslintPluginUnicorn.configs["flat/recommended"],
	// @ts-ignore
	eslintPerfectionist.configs["recommended-alphabetical"],
	{
		files: Constants.tsEslintFiles,
		ignores: Constants.ignoreFiles,
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: [
					"./tsconfig.eslint.json",
					"./apps/*/tsconfig.json",
					"./etc/*/tsconfig.json",
					"./libs/*/tsconfig.json",
					"./app/tsconfig.json",
				],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNullish: true,
					allowNumber: true,
				},
			],
			"array-element-newline": ["error", "always"],
			"react-hooks/exhaustive-deps": "error",
			"react/no-unknown-property": ["error", { ignore: ["css"] }],
			"react/prop-types": "off",
			"react/react-in-jsx-scope": "off",
			"unicorn/prevent-abbreviations": [
				"error",
				{
					replacements: Constants.abbreviations,
				},
			],
		},

		settings: {
			react: {
				version: "detect",
			},
		},
	},
	...withFiles(eslintJsonc.configs["flat/recommended-with-jsonc"], [
		...Constants.jsoncFiles,
	]),
	...withFiles(eslintPluginYml.configs["flat/standard"], Constants.ymlFiles),
	{
		files: Constants.ymlFiles,
		rules: {
			"unicorn/prevent-abbreviations": [
				"error",
				{
					replacements: Constants.abbreviations,
				},
			],
		},
	},
	eslintPluginPrettierRecommended,
);
