import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { VscodeExtensionRecommendations } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("recommendations are added to vanilla project", () => {
  // WHEN
  const project = new Project({
    outdir: mkdtemp(),
    name: "test-project",
  });
  new VscodeExtensionRecommendations(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".vscode/extensions.json");
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "MarkMcCulloh.vscode-projen"
  );
  expect(snapshot[".vscode/extensions.json"].recommendations).not.toContain(
    "dbaeumer.vscode-eslint"
  );
  expect(snapshot[".gitignore"]).toMatch("!/.vscode/extensions.json");
});

test("recommendations are added to TypeScript project", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new VscodeExtensionRecommendations(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".vscode/extensions.json");
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "MarkMcCulloh.vscode-projen"
  );
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "dbaeumer.vscode-eslint"
  );
  expect(snapshot[".gitignore"]).toMatch("!/.vscode/extensions.json");
});

test("recommendations not added to vanilla project", () => {
  // WHEN
  const project = new Project({
    outdir: mkdtemp(),
    name: "test-project",
  });
  new VscodeExtensionRecommendations(project, {
    vscodeExtensionRecommendations: false,
  });
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).not.toContain(".vscode/extensions.json");
  expect(snapshot[".gitignore"]).not.toMatch("!/.vscode/extensions.json");
});

test("recommendations are added to TypeScript project, but recommendations are deleted", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  vscodeExtensionRecommendations.deleteRecommendations();
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).not.toContain(".vscode/extensions.json");
  expect(snapshot[".gitignore"]).not.toMatch("!/.vscode/extensions.json");
});

test("recommendations are added to TypeScript project, and extra recommendation is added", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  vscodeExtensionRecommendations.addRecommendations(
    "streetsidesoftware.code-spell-checker"
  );
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".vscode/extensions.json");
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "MarkMcCulloh.vscode-projen"
  );
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "dbaeumer.vscode-eslint"
  );
  expect(snapshot[".vscode/extensions.json"].recommendations).toContain(
    "streetsidesoftware.code-spell-checker"
  );
  expect(snapshot[".gitignore"]).toMatch("!/.vscode/extensions.json");
});

test("recommendations are added to TypeScript project, but recommendations are overriden", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
    project
  );
  vscodeExtensionRecommendations.overrideRecommendations(
    "streetsidesoftware.code-spell-checker"
  );
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain(".vscode/extensions.json");
  expect(snapshot[".vscode/extensions.json"].recommendations).toEqual([
    "streetsidesoftware.code-spell-checker",
  ]);
  expect(snapshot[".gitignore"]).toMatch("!/.vscode/extensions.json");
});
