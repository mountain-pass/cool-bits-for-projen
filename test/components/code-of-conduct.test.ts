import { Project } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { CodeOfConduct, CSpell } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("code of conduct added to a vanilla project", () => {
  // WHEN
  const project = new Project({
    outdir: mkdtemp(),
    name: "test-project",
  });
  new CodeOfConduct(project, { contactMethod: "test@test.com" });
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain("CODE_OF_CONDUCT.md");
  expect(snapshot["CODE_OF_CONDUCT.md"]).toMatch("test@test.com");
});

test("code of conduct added to a project with cSpell", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new CSpell(project);
  new CodeOfConduct(project, { contactMethod: "test@test.com" });
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain("CODE_OF_CONDUCT.md");
  expect(snapshot["CODE_OF_CONDUCT.md"]).toMatch("test@test.com");
  expect(snapshot[".cspell.json"].overrides).toEqual([
    {
      language: "en",
      filename: "CODE_OF_CONDUCT.md",
      words: ["socio-economic"],
    },
  ]);
});

test("code of conduct added to a project with cSpell after", () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  new CodeOfConduct(project, { contactMethod: "test@test.com" });
  new CSpell(project);
  const snapshot = synthSnapshot(project);

  expect(Object.keys(snapshot)).toContain("CODE_OF_CONDUCT.md");
  expect(snapshot["CODE_OF_CONDUCT.md"]).toMatch("test@test.com");
  expect(snapshot[".cspell.json"].overrides).toEqual([
    {
      language: "en",
      filename: "CODE_OF_CONDUCT.md",
      words: ["socio-economic"],
    },
  ]);
});
