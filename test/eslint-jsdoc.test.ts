import { TypeScriptProject } from "projen/lib/typescript";
import { EslintJsdoc } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("jsdoc is added to eslint", () => {
  const project = new TypeScriptProject({
    ...EslintJsdoc.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintJsdoc(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "eslint-plugin-jsdoc"
  );
  // expect(snapshot["package.json"].devDependencies).toHaveProperty(
  //   "eslint-plugin-jsdoc-typescript"
  // );

  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).toContain("jsdoc");
  expect(snapshot[".eslintrc.json"].extends).toContain(
    "plugin:jsdoc/recommended"
  );
});

test("jsdoc is not added when disabled", () => {
  const project = new TypeScriptProject({
    ...EslintJsdoc.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintJsdoc(project, { eslintJsdoc: false });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-jsdoc"
  );
  // expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
  //   "eslint-plugin-jsdoc-typescript"
  // );

  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).not.toContain("jsdoc");
  expect(snapshot[".eslintrc.json"].extends).not.toContain(
    "plugin:jsdoc/recommended"
  );
});

test("jsdoc is not added when eslint is disabled", () => {
  const project = new TypeScriptProject({
    ...EslintJsdoc.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    eslint: false,
  });
  new EslintJsdoc(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-jsdoc"
  );
  // expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
  //   "eslint-plugin-jsdoc-typescript"
  // );

  expect(Object.keys(snapshot)).not.toContain(".eslintrc.json");
});
