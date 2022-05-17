import { NpmAccess } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Recommended } from "./src";

const name = "cool-bits-for-projen";

const projectOptions: TypeScriptProjectOptions = Object.assign({
  name,
  description: "A collection of cool projen components",
  peerDeps: ["projen"],
  deps: ["merge", "traverse", "@commitlint/types"],
  bundledDeps: ["merge", "traverse"],
  devDeps: ["fs-extra", "@types/fs-extra", "@types/traverse"],
  keywords: ["typescript", "projen", "jsii"],
  packageName: `@mountainpass/${name}`,
  homepage: `https://github.com/mountain-pass/${name}`,
  repository: `https://github.com/mountain-pass/${name}.git`,
  repositoryUrl: `https://github.com/mountain-pass/${name}.git`,
  bugsUrl: `https://github.com/mountain-pass/${name}/issues`,
  author: "Mountain Pass",
  authorAddress: "info@mountain-pass.com.au",
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
  authorName: "Mountain Pass",
  authorEmail: "info@mountain-pass.com.au",
  authorOrganization: true,
  copyrightOwner: "Mountain Pass Pty Ltd",
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
  ...projectOptions,
  ...Recommended.defaultProjectOptions,
});
new Recommended(project);

project.addGitIgnore("/docs");

project.synth();
