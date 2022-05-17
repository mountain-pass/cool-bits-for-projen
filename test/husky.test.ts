import { TypeScriptProject } from "projen/lib/typescript";
import { Husky } from "../src";
import { synthSnapshot, mkdtemp } from "./util";

test("husky is added", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Husky(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("husky");
  expect(snapshot["package.json"].scripts).toHaveProperty("prepare");
  expect(Object.keys(snapshot)).toContain(".husky/pre-push");
  expect(snapshot[".husky/pre-push"]).toMatch(/^\s*npm run test\s*$/m);
});

test("husky is not added", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Husky(project, { husky: false });
  // THEN
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).not.toHaveProperty("husky");
  expect(snapshot["package.json"].scripts).not.toHaveProperty("prepare");
  expect(Object.keys(snapshot)).not.toContain(".husky/pre-push");
});

test("husky is added but hook is deleted", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  husky.deleteHook("pre-push");
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("husky");
  expect(snapshot["package.json"].scripts).toHaveProperty("prepare");
  expect(Object.keys(snapshot)).not.toContain(".husky/pre-push");
});

test("extra husk hook step is added", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  const command = "ls -l";
  husky.addHook("pre-push", command);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("husky");
  expect(snapshot["package.json"].scripts).toHaveProperty("prepare");
  expect(Object.keys(snapshot)).toContain(".husky/pre-push");
  expect(snapshot[".husky/pre-push"]).toMatch(/^\s*npm run test\s*$/m);
  expect(snapshot[".husky/pre-push"]).toMatch(command);
});

test("override husk hook", () => {
  // WHEN
  const project = new TypeScriptProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const husky = new Husky(project);
  const command = "ls -l";
  husky.overrideHook("pre-push", command);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].devDependencies).toHaveProperty("husky");
  expect(snapshot["package.json"].scripts).toHaveProperty("prepare");
  expect(Object.keys(snapshot)).toContain(".husky/pre-push");
  expect(snapshot[".husky/pre-push"]).not.toMatch(
    /^\s*npm run test:update\s*$/m
  );
  expect(snapshot[".husky/pre-push"]).toMatch(command);
});
