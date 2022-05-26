import { NodeProject } from "projen/lib/javascript";
import { Contributors } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("contributors defaults", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Contributors(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].contributors).not.toBeUndefined();
});

test("contributors without git", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Contributors(project, { autoPopulateFromGit: false });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].contributors).toBeUndefined();
});

test("contributors with config", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new Contributors(project, {
    additionalContributors: ["Seymour Butz <Seymour@Butz.com>"],
  });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].contributors).toContain(
    "Seymour Butz <Seymour@Butz.com>"
  );
});

test("contributors  added", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  const contributors = new Contributors(project);
  contributors.addContributors("Seymour Butz <Seymour@Butz.com>");
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].contributors).toContain(
    "Seymour Butz <Seymour@Butz.com>"
  );
});
