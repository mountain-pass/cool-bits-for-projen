import { NpmAccess } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { Recommended, Organisational, CodeOfConduct, GitHubber } from "./src";

const name = "cool-bits-for-projen";

const organisational = new Organisational({
  organisation: {
    name: "Mountain Pass",
    email: "info@mountain-pass.com.au",
    url: "https://mountain-pass.com.au",
  },
  contributors: [
    {
      name: "Tom Howard",
      email: "tom@mountain-pass.com.au",
    },
  ],
});

const gitHubber = new GitHubber({
  name,
  githubUsername: "mountain-pass",
});

const project = new TypeScriptProject({
  ...organisational.nodeProjectOptions(),
  ...gitHubber.nodeProjectOptions(),
  ...Recommended.defaultProjectOptions,
  description: "A collection of cool projen components",
  peerDeps: ["projen"],
  deps: [
    "merge",
    "traverse",
    "@commitlint/types",
    "@cspell/cspell-types",
    "fs-extra",
    "@types/fs-extra",
  ],
  bundledDeps: ["merge", "traverse"],
  devDeps: ["@types/traverse"],
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

const recommended = new Recommended(project, {
  cSpellOptions: {
    language: "en-GB",
    overrides: [
      {
        language: "en",
        filename: "src/code-of-conduct-text/contributor-covenant-2.1.md",
        words: ["socio-economic"],
      },
    ],
  },
});

gitHubber.addToProject(project);
gitHubber.addDependencies({ cSpell: recommended.cSpell });

new CodeOfConduct(
  project,
  { contactMethod: "tom@mountain-pass.com.au" },
  { cSpell: recommended.cSpell }
);

project.addGitIgnore("/docs");

project.synth();
