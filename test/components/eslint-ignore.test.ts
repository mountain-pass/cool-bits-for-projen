import { TypeScriptProject } from "projen/lib/typescript";
import { EslintIgnore } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("ignore file is added", () => {
  const project = new TypeScriptProject({
    ...EslintIgnore.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintIgnore(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".eslintignore");
  expect(snapshot[".eslintignore"].split("\n")).toContain("package.json");
  expect(snapshot[".eslintignore"].split("\n")).toContain(
    project.tsconfig?.fileName
  );
});

test("ignore is not added when disabled", () => {
  const project = new TypeScriptProject({
    ...EslintIgnore.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintIgnore(project, { eslintIgnore: false });
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).not.toContain(".eslintignore");
});

test("ignore file is not added when eslint is disabled", () => {
  const project = new TypeScriptProject({
    ...EslintIgnore.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    eslint: false,
  });
  new EslintIgnore(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).not.toContain(".eslintignore");
});
