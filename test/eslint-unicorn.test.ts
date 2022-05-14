import { TypeScriptProject } from "projen/lib/typescript";
import { EslintUnicorn } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("unicorn is added to eslint", () => {
  const project = new TypeScriptProject({
    ...EslintUnicorn.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintUnicorn(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "eslint-plugin-unicorn"
  );
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).toContain("unicorn");
  expect(snapshot[".eslintrc.json"].extends).toContain(
    "plugin:unicorn/recommended"
  );
});

test("unicorn is not added when disabled", () => {
  const project = new TypeScriptProject({
    ...EslintUnicorn.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintUnicorn(project, { eslintUnicorn: false });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-unicorn"
  );
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).not.toContain("unicorn");
  expect(snapshot[".eslintrc.json"].extends).not.toContain(
    "plugin:unicorn/recommended"
  );
});

test("unicorn is not added when eslint is disabled", () => {
  const project = new TypeScriptProject({
    ...EslintUnicorn.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    eslint: false,
  });
  new EslintUnicorn(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-unicorn"
  );
  expect(Object.keys(snapshot)).not.toContain(".eslintrc.json");
});
