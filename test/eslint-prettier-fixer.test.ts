import { TypeScriptProject } from "projen/lib/typescript";
import { EslintPrettierFixer } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("prettier is added last to eslint", () => {
  // WHEN
  const project = new TypeScriptProject({
    ...EslintPrettierFixer.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintPrettierFixer(project);
  project.eslint?.addExtends("NotPrettier");
  // THEN
  const snapshot = synthSnapshot(project);

  // const outDir = project.outdir.substr(1);

  expect(Object.keys(snapshot)).toContain(".prettierrc.json");
  expect(Object.keys(snapshot)).toContain(".prettierignore");
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(
    snapshot[".eslintrc.json"].extends[
      snapshot[".eslintrc.json"].extends.length - 1
    ]
  ).toEqual("prettier");
});

test("prettier is not added when prettier is disabled", () => {
  // WHEN
  const project = new TypeScriptProject({
    ...EslintPrettierFixer.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    prettier: false,
  });
  new EslintPrettierFixer(project, { eslintPrettierFixer: false });
  project.eslint?.addExtends("NotPrettier");
  // THEN
  const snapshot = synthSnapshot(project);

  // const outDir = project.outdir.substr(1);

  expect(Object.keys(snapshot)).not.toContain(".prettierrc.json");
  expect(Object.keys(snapshot)).not.toContain(".prettierignore");
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(
    snapshot[".eslintrc.json"].extends[
      snapshot[".eslintrc.json"].extends.length - 1
    ]
  ).not.toEqual("prettier");
});

test("prettier is not added when eslint is disabled", () => {
  // WHEN
  const project = new TypeScriptProject({
    ...EslintPrettierFixer.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    eslint: false,
  });
  new EslintPrettierFixer(project);
  // THEN
  const snapshot = synthSnapshot(project);

  // const outDir = project.outdir.substr(1);

  expect(Object.keys(snapshot)).toContain(".prettierrc.json");
  expect(Object.keys(snapshot)).toContain(".prettierignore");
  expect(Object.keys(snapshot)).not.toContain(".eslintrc.json");
});

test("prettier is not added when prettier is disabled", () => {
  // WHEN
  const project = new TypeScriptProject({
    ...EslintPrettierFixer.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    prettier: false,
  });
  new EslintPrettierFixer(project);
  // THEN
  project.eslint?.addExtends("NotPrettier");

  const snapshot = synthSnapshot(project);

  // const outDir = project.outdir.substr(1);

  expect(Object.keys(snapshot)).not.toContain(".prettierrc.json");
  expect(Object.keys(snapshot)).not.toContain(".prettierignore");
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(
    snapshot[".eslintrc.json"].extends[
      snapshot[".eslintrc.json"].extends.length - 1
    ]
  ).not.toEqual("prettier");
});
