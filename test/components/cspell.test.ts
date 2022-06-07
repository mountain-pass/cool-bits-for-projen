import { JsiiProject } from "projen/lib/cdk";
import { TypeScriptProject } from "projen/lib/typescript";
import { Husky, CSpell, VscodeExtensionRecommendations } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("cSpell is added with Husky and VscodeExtensionRecommendations", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new CSpell(project);

  const husky = new Husky(project);
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("cspell");
  expect(Object.keys(snapshot)).toContain(".cspell.json");
  expect(Object.keys(snapshot)).toContain(".project-words.txt");
  expect(husky.options.huskyHooks["commit-msg"]).toContain(
    'npx --no -- cspell lint --show-suggestions "${1}"'
  );
  expect(husky.options.huskyHooks["pre-commit"][0]).toMatch("cspell lint");
  expect(snapshot["package.json"].scripts).toHaveProperty("spellcheck");
  expect(snapshot[".cspell.json"].words).toContain(
    vscodeExtensionRecommendations.options.vscodeExtensionRecommendationsOptions.recommendations[0].split(
      "."
    )[0]
  );
  expect(snapshot[".cspell.json"].words).toContain(husky.getHookNames()[0]);
});

test("cSpell is not added", () => {
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  new VscodeExtensionRecommendations(project);
  new CSpell(project, { cSpell: false });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty("cspell");
  expect(Object.keys(snapshot)).not.toContain(".cspell.json");
  expect(Object.keys(snapshot)).not.toContain(".project-words.txt");
  expect(husky.options.huskyHooks["commit-msg"]).not.toContain(
    'npx --no -- cspell lint --show-suggestions "${1}"'
  );
  expect(husky.options.huskyHooks["pre-commit"]).toHaveLength(0);
  expect(snapshot["package.json"].scripts).not.toHaveProperty("spellcheck");
});

test("cSpell is added with Husky and VscodeExtensionRecommendations to a JsiiProject", () => {
  // WHEN
  const project = new JsiiProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    repositoryUrl: "",
    author: "",
    authorAddress: "",
  });
  const husky = new Husky(project);
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  new CSpell(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("cspell");
  expect(Object.keys(snapshot)).toContain(".cspell.json");
  expect(Object.keys(snapshot)).toContain(".project-words.txt");
  expect(husky.options.huskyHooks["commit-msg"]).toContain(
    'npx --no -- cspell lint --show-suggestions "${1}"'
  );
  expect(husky.options.huskyHooks["pre-commit"][0]).toMatch("cspell lint");
  expect(snapshot["package.json"].scripts).toHaveProperty("spellcheck");
  expect(snapshot[".cspell.json"].words).toContain(
    vscodeExtensionRecommendations.options.vscodeExtensionRecommendationsOptions.recommendations[0].split(
      "."
    )[0]
  );
  expect(snapshot[".cspell.json"].words).toContain(husky.getHookNames()[0]);
  expect(snapshot[".cspell.json"].words).toContain("jsii");
});

test("cSpell is added without a custom dictionary", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new CSpell(project, { cSpellOptions: { dictionaryDefinitions: [] } });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("cspell");
  expect(Object.keys(snapshot)).toContain(".cspell.json");
  expect(Object.keys(snapshot)).not.toContain(".project-words.txt");
});
