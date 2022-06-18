import { NpmAccess } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import {
  Recommended,
  Organisational,
  CodeOfConduct,
  GitHubber,
  NpmReleaser,
} from "./src";

const gitHubber = new GitHubber({
  name: "cool-bits-for-projen",
  username: "mountain-pass",
});

const npmReleaser = new NpmReleaser(gitHubber, {
  scope: "mountainpass",
  access: NpmAccess.PUBLIC,
  release: true,
});

const organisational = new Organisational({
  organisation: {
    name: "Mountain Pass",
    email: "info@mountain-pass.com.au",
    url: "https://mountain-pass.com.au",
  },
});

const project = new TypeScriptProject({
  ...gitHubber.nodeProjectOptions(),
  ...organisational.nodeProjectOptions(),
  ...npmReleaser.nodeProjectOptions(),
  ...Recommended.defaultProjectOptions,
  description: "A collection of cool projen components",
  peerDeps: ["projen"],
  bundledDeps: [
    "merge",
    "traverse",
    "fs-extra",
    "shelljs",
    "cspell",
    "@cspell/cspell-types",
    "shelljs-plugin-authors",
    "@commitlint/config-conventional",
    "@commitlint/cli",
    "@commitlint/types",
  ],
  devDeps: [
    "@types/traverse",
    "@types/shelljs",
    "@commitlint/types",
    "@types/fs-extra",
  ],
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
  defaultReleaseBranch: "main",
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
  projenrcTs: true,
  license: "Apache-2.0",
  codeCov: true,
  // buildWorkflowTriggers: {
  //   pullRequest: {},
  //   workflowDispatch: {},
  //   push: { branches: ["main"] },
  // },
  docgen: true,
  eslintOptions: {
    dirs: ["."],
  },
  dependabot: true,
  dependabotOptions: {
    labels: ["auto-approve"],
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
organisational.addToProject(project);

new Recommended(project, {
  cSpellOptions: {
    language: "en-GB",
    overrides: [
      {
        language: "en",
        filename: "code-of-conduct-text/contributor-covenant-2.1.md",
        words: ["socio-economic"],
      },
    ],
  },
});

gitHubber.addToProject(project);
npmReleaser.addToProject(project);

new CodeOfConduct(project, { contactMethod: "tom@mountain-pass.com.au" });

project.addGitIgnore("/docs");

project.synth();
