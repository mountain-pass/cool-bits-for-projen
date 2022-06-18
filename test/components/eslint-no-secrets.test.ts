import { TypeScriptProject } from "projen/lib/typescript";
import { EslintJsonC, EslintNoSecrets } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("noSecrets is added to eslint", () => {
  const project = new TypeScriptProject({
    ...EslintNoSecrets.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintNoSecrets(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "eslint-plugin-no-secrets"
  );
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).toContain("no-secrets");
});

test("noSecrets is not added when disabled", () => {
  const project = new TypeScriptProject({
    ...EslintNoSecrets.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintNoSecrets(project, { eslintNoSecrets: false });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-no-secrets"
  );
  expect(Object.keys(snapshot)).toContain(".eslintrc.json");
  expect(snapshot[".eslintrc.json"].plugins).not.toContain("no-secrets");
});

test("noSecrets is not added when eslint is disabled", () => {
  const project = new TypeScriptProject({
    ...EslintNoSecrets.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    eslint: false,
  });
  new EslintNoSecrets(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-no-secrets"
  );
  expect(Object.keys(snapshot)).not.toContain(".eslintrc.json");
});

test("noSecrets is added for json linting", () => {
  const project = new TypeScriptProject({
    ...EslintNoSecrets.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintJsonC(project);
  new EslintNoSecrets(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".eslintrc-json.json");
  expect(snapshot[".eslintrc-json.json"].plugins).toContain("no-secrets");
});

test("noSecrets is not added for json linting of json linting is disabled", () => {
  const project = new TypeScriptProject({
    ...EslintNoSecrets.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new EslintJsonC(project, { eslintJsonC: false });
  new EslintNoSecrets(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).not.toContain(".eslintrc-json.json");
});
