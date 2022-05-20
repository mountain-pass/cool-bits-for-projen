import { JsiiProject } from "projen/lib/cdk";
import { NodeProject } from "projen/lib/javascript";
import { CSpell, GitHubber } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("without homepage", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
  });
  const project = new NodeProject({
    ...gitHubber.nodeProjectOptions(),
    outdir: mkdtemp(),
    defaultReleaseBranch: "main",
  });
  gitHubber.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].repository.url).toEqual(
    "https://github.com/test-org/test-project.git"
  );
  expect(snapshot["package.json"].bugs.url).toEqual(
    "https://github.com/test-org/test-project/issues"
  );
  expect(snapshot["package.json"].homepage).toEqual(
    "https://github.com/test-org/test-project"
  );
});

test("with homepage", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
    homepage: "https://test.com",
  });
  const project = new NodeProject({
    ...gitHubber.nodeProjectOptions(),
    outdir: mkdtemp(),
    defaultReleaseBranch: "main",
  });
  gitHubber.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].repository.url).toEqual(
    "https://github.com/test-org/test-project.git"
  );
  expect(snapshot["package.json"].bugs.url).toEqual(
    "https://github.com/test-org/test-project/issues"
  );
  expect(snapshot["package.json"].homepage).toEqual("https://test.com");
});

test("jsii project gitHubber", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
    homepage: "https://test.com",
  });
  const project = new JsiiProject({
    ...gitHubber.jsiiProjectOptions(),
    outdir: mkdtemp(),
    defaultReleaseBranch: "main",
    author: "test-org",
    authorAddress: "test@test.com",
  });
  gitHubber.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].repository.url).toEqual(
    "https://github.com/test-org/test-project.git"
  );
  expect(snapshot["package.json"].bugs.url).toEqual(
    "https://github.com/test-org/test-project/issues"
  );
  expect(snapshot["package.json"].homepage).toEqual("https://test.com");
});
test("with cSpell", () => {
  const gitHubber = new GitHubber({
    name: "test-project",
    username: "test-org",
    homepage: "https://test.com",
  });
  const project = new NodeProject({
    ...gitHubber.nodeProjectOptions(),
    outdir: mkdtemp(),
    defaultReleaseBranch: "main",
  });
  gitHubber.addToProject(project);
  gitHubber.addDependencies({ cSpell: new CSpell(project) });
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].repository.url).toEqual(
    "https://github.com/test-org/test-project.git"
  );
  expect(snapshot["package.json"].bugs.url).toEqual(
    "https://github.com/test-org/test-project/issues"
  );
  expect(snapshot["package.json"].homepage).toEqual("https://test.com");
  expect(snapshot[".cspell.json"].words).toContain("hubber");
});
