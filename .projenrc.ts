import { TypeScriptProject } from "projen/lib/typescript";
import { Recommended } from "./src";

const name = "cool-bits-for-projen";

const projectOptions = Object.assign({
  name,
  description: "A collection of cool projen components",
  peerDeps: ["projen"],
  deps: ["merge", "traverse"],
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
});
const project = new TypeScriptProject({
  ...projectOptions,
  ...Recommended.defaultProjectOptions,
});
new Recommended(project);
project.synth();
