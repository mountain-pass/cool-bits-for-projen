import { TypeScriptProject } from "projen/lib/typescript";
import { Husky, Commitlint, VscodeExtensionRecommendations } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("commitlint is added with Husky and VscodeExtensionRecommendations", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  new Commitlint(project, undefined, { husky, vscodeExtensionRecommendations });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "@commitlint/config-conventional"
  );
  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "@commitlint/cli"
  );
  expect(Object.keys(snapshot)).toContain(".commitlintrc.json");
  const commitlintrc = snapshot[".commitlintrc.json"];
  delete commitlintrc["//"];
  expect(commitlintrc).toEqual(Commitlint.defaultOptions.commitlintOptions);
  expect(husky.options.huskyHooks["commit-msg"]).toContain(
    'npx --no -- commitlint --edit "${1}"'
  );
  expect(
    vscodeExtensionRecommendations.options.vscodeExtensionRecommendationsOptions
      .recommendations
  ).toContain("adam-bender.commit-message-editor");
});

test("commitlint is not added", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  new Commitlint(
    project,
    { commitlint: false },
    { husky, vscodeExtensionRecommendations }
  );
  // THEN
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "@commitlint/config-conventional"
  );
  expect(snapshot["package.json"].devDependencies).not.toHaveProperty(
    "@commitlint/cli"
  );
  expect(Object.keys(snapshot)).not.toContain(".commitlintrc.json");
  expect(husky.options.huskyHooks["commit-msg"]).not.toContain(
    'npx --no -- commitlint --edit "${1}"'
  );
  expect(
    vscodeExtensionRecommendations.options.vscodeExtensionRecommendationsOptions
      .recommendations
  ).not.toContain("adam-bender.commit-message-editor");
});

test("commitlint is added without Husky and VscodeExtensionRecommendations", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  new Commitlint(project, undefined);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "@commitlint/config-conventional"
  );
  expect(snapshot["package.json"].devDependencies).toHaveProperty(
    "@commitlint/cli"
  );
  expect(Object.keys(snapshot)).toContain(".commitlintrc.json");
  const commitlintrc = snapshot[".commitlintrc.json"];
  delete commitlintrc["//"];
  expect(commitlintrc).toEqual(Commitlint.defaultOptions.commitlintOptions);
  expect(husky.options.huskyHooks["commit-msg"]).not.toContain(
    'npx --no -- commitlint --edit "${1}"'
  );
  expect(
    vscodeExtensionRecommendations.options.vscodeExtensionRecommendationsOptions
      .recommendations
  ).not.toContain("adam-bender.commit-message-editor");
});
