import { NpmAccess } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Recommended, Organisational } from "./src";

const name = "cool-bits-for-projen";

const organisational = new Organisational({
  organisation: {
    name: "Mountain Pass",
    email: "info@mountain-pass.com.au",
    url: "https://mountain-pass.com.au",
    // npmOrganisationName: "mountainpass",
    // githubOrganisationName: "mountain-pass",
  },
  contributors: [
    {
      name: "Tom Howard",
      email: "tom@mountain-pass.com.au",
    },
  ],
});

const projectOptions: TypeScriptProjectOptions = Object.assign({
  name,
  description: "A collection of cool projen components",
  peerDeps: ["projen"],
  deps: ["merge", "traverse", "@commitlint/types", "@cspell/cspell-types"],
  bundledDeps: ["merge", "traverse"],
  devDeps: ["fs-extra", "@types/fs-extra", "@types/traverse"],
  keywords: [
    "typescript",
    "projen",
    "projen-component",
    "projen-component",
    "cspell",
    "eslint-jsdoc",
    "prettier",
    "eslint-unicorn",
    "husky",
    "vscode-extension-recommendations",
  ],
  packageName: `@mountainpass/${name}`,
  homepage: `https://github.com/mountain-pass/${name}`,
  repository: `https://github.com/mountain-pass/${name}.git`,
  repositoryUrl: `https://github.com/mountain-pass/${name}.git`,
  bugsUrl: `https://github.com/mountain-pass/${name}/issues`,
  defaultReleaseBranch: "main",
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
  projenrcTs: true,
  npmDistTag: "latest",
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  license: "Apache-2.0",
  codeCov: true,
  prettier: true,
  docgen: true,
  eslint: true,
  eslintOptions: {
    dirs: ["."],
  },
  dependabot: true,
  dependabotOptions: {
    labels: ["auto-approve"],
  },
  eslintUnicorn: true,
  eslintJsdoc: true,
  husky: true,
  commitlint: true,
  commitlintOptions: { extends: ["@commitlint/config-conventional"] },
  cSpell: true,
  cSpellOptions: {
    language: "en-GB",
    words: [
      "commitlint",
      "docgen",
      "projen",
      "projenrc",
      "unbump",
      "mountainpass",
      "dbaeumer",
      "outdir",
      "jsii",
    ],
  },
  vscodeExtensions: true,
  vscodeExtensionsOptions: {
    recommendations: [
      "dbaeumer.vscode-eslint",
      "streetsidesoftware.code-spell-checker",
      "MarkMcCulloh.vscode-projen",
      "adam-bender.commit-message-editor",
    ],
  },
  jestOptions: {
    jestConfig: {
      coverageThreshold: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["dependabot[bot]"],
    label: "auto-approve",
    secret: "GITHUB_TOKEN",
  },
  githubOptions: {
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: [
          "build",
          "chore",
          "ci",
          "docs",
          "feat",
          "fix",
          "perf",
          "refactor",
          "revert",
          "style",
          "test",
        ],
      },
    },
  },
});
const project = new TypeScriptProject({
  ...organisational.nodeProjectOptions(),
  ...projectOptions,
  ...Recommended.defaultProjectOptions,
});
organisational.addToProject(project);

new Recommended(project, { cSpellOptions: { language: "en-GB" } });

project.addGitIgnore("/docs");

project.synth();
