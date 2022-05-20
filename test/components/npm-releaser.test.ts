import { NodeProject, NpmAccess } from "projen/lib/javascript";
import { GitHubber, NpmReleaser } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("just the name", () => {
  const npmReleaser = new NpmReleaser({
    name: "test-project",
  });
  const project = new NodeProject({
    ...npmReleaser.nodeProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  npmReleaser.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].name).toEqual("test-project");
  expect(snapshot["package.json"].publishConfig).toBeUndefined();
});

test("set all the things", () => {
  const npmReleaser = new NpmReleaser({
    name: "test-project",
    scope: "test-org",
    access: NpmAccess.PUBLIC,
    registryUrl: "https://registry.test.com/",
    release: true,
  });
  const project = new NodeProject({
    ...npmReleaser.nodeProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  npmReleaser.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].name).toEqual("@test-org/test-project");
  expect(snapshot["package.json"].publishConfig.access).toEqual("public");
  expect(snapshot["package.json"].publishConfig.registry).toEqual(
    "https://registry.test.com/"
  );
});

test("with gitHubber", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
  });
  const npmReleaser = new NpmReleaser(gitHubber, {
    access: NpmAccess.PUBLIC,
    registryUrl: "https://registry.test.com/",
    release: true,
  });
  const project = new NodeProject({
    ...npmReleaser.nodeProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  npmReleaser.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].name).toEqual("@test-org/test-project");
  expect(snapshot["package.json"].publishConfig.access).toEqual("public");
  expect(snapshot["package.json"].publishConfig.registry).toEqual(
    "https://registry.test.com/"
  );
});

test("with gitHubber, but override", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
  });
  const npmReleaser = new NpmReleaser(gitHubber, {
    name: "test-project-override",
    scope: "test-org-override",
    access: NpmAccess.PUBLIC,
    registryUrl: "https://registry.test.com/",
    release: true,
  });
  const project = new NodeProject({
    ...npmReleaser.nodeProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  npmReleaser.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].name).toEqual(
    "@test-org-override/test-project-override"
  );
  expect(snapshot["package.json"].publishConfig.access).toEqual("public");
  expect(snapshot["package.json"].publishConfig.registry).toEqual(
    "https://registry.test.com/"
  );
});
