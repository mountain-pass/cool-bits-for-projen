import { TypeScriptProject } from "projen/lib/typescript";
import { Recommended } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("unicorn, husky, eslint-prettier-fixer, etc are added to the project", () => {
  const project = new TypeScriptProject({
    ...Recommended.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Recommended(project);
  const snapshot = synthSnapshot(project);

  expect(project.eslint).not.toBeUndefined();
  expect(project.prettier).not.toBeUndefined();
  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "eslint-plugin-unicorn"
  );
  expect(snapshot["package.json"].devDependencies).toHaveProperty("husky");
  expect(
    snapshot[".eslintrc.json"].extends[
      snapshot[".eslintrc.json"].extends.length - 1
    ]
  ).toEqual("prettier");
  expect(Object.keys(snapshot)).toContain(".commitlintrc.json");
  expect(Object.keys(snapshot)).toContain(".vscode/extensions.json");
  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "eslint-plugin-jsdoc"
  );
  expect(snapshot["package.json"].devDependencies).toHaveProperty("cspell");
  expect(snapshot["package.json"].contributors).not.toBeUndefined();
});

test("unicorn, husky, eslint-prettier-fixer, etc can be turned off", () => {
  const project = new TypeScriptProject({
    ...Recommended.defaultProjectOptions,
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Recommended(project, {
    eslintUnicorn: false,
    husky: false,
    eslintPrettierFixer: false,
    commitlint: false,
    vscodeExtensionRecommendations: false,
    eslintJsdoc: false,
    cSpell: false,
    contributors: false,
  });
  project.eslint?.addExtends("NotPrettier");
  const snapshot = synthSnapshot(project);

  expect(project.eslint).not.toBeUndefined();
  expect(project.prettier).not.toBeUndefined();
  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-unicorn"
  );
  expect(snapshot["package.json"].devDependencies).not.toHaveProperty("husky");
  expect(
    snapshot[".eslintrc.json"].extends[
      snapshot[".eslintrc.json"].extends.length - 1
    ]
  ).not.toEqual("prettier");
  expect(Object.keys(snapshot)).not.toContain(".commitlintrc.json");
  expect(Object.keys(snapshot)).not.toContain(".vscode/extensions.json");
  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "eslint-plugin-jsdoc"
  );
  expect(snapshot["package.json"].devDependencies).not.toHaveProperty("cspell");
  expect(snapshot["package.json"].contributors).toBeUndefined();
});
