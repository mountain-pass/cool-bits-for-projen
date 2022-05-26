import { JsiiProject } from "projen/lib/cdk";
import { NodeProject } from "projen/lib/javascript";
import { Organisational } from "../../src";
import { synthSnapshot, mkdtemp } from "../util/util";

test("org", () => {
  const organisational = new Organisational({
    organisation: {
      name: "test-organisation",
      email: "test@test.com",
      url: "https://test.com",
    },
  });
  const project = new NodeProject({
    ...organisational.nodeProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  organisational.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].author.name).toEqual("test-organisation");
  expect(snapshot["package.json"].author.email).toEqual("test@test.com");
  expect(snapshot["package.json"].author.url).toEqual("https://test.com");
  expect(snapshot["package.json"].contributors).toBeUndefined();
});

// test("org with contributors in constructor", () => {
//   const organisational = new Organisational({
//     organisation: {
//       name: "test-organisation",
//       email: "test@test.com",
//       url: "https://test.com",
//     },
//     contributors: [
//       "I.P. Freely",
//       {
//         name: "Jacques Strap",
//         email: "jacques@strap.com",
//         url: "https://strap.com",
//       },
//     ],
//   });
//   const project = new NodeProject({
//     ...organisational.nodeProjectOptions(),
//     outdir: mkdtemp(),
//     name: "test-project",
//     defaultReleaseBranch: "main",
//   });
//   organisational.addToProject(project);
//   const snapshot = synthSnapshot(project);

//   expect(snapshot["package.json"].author.name).toEqual("test-organisation");
//   expect(snapshot["package.json"].author.email).toEqual("test@test.com");
//   expect(snapshot["package.json"].author.url).toEqual("https://test.com");
//   expect(snapshot["package.json"].contributors).toEqual([
//     "I.P. Freely",
//     {
//       name: "Jacques Strap",
//       email: "jacques@strap.com",
//       url: "https://strap.com",
//     },
//   ]);
// });

// test("org with contributors added", () => {
//   const organisational = new Organisational({
//     organisation: {
//       name: "test-organisation",
//       email: "test@test.com",
//       url: "https://test.com",
//     },
//   });
//   const project = new NodeProject({
//     ...organisational.nodeProjectOptions(),
//     outdir: mkdtemp(),
//     name: "test-project",
//     defaultReleaseBranch: "main",
//   });
//   organisational.addToProject(project);
//   organisational.addContributors("I.P. Freely", {
//     name: "Jacques Strap",
//     email: "jacques@strap.com",
//     url: "https://strap.com",
//   });
//   const snapshot = synthSnapshot(project);

//   expect(snapshot["package.json"].author.name).toEqual("test-organisation");
//   expect(snapshot["package.json"].author.email).toEqual("test@test.com");
//   expect(snapshot["package.json"].author.url).toEqual("https://test.com");
//   expect(snapshot["package.json"].contributors).toEqual([
//     "I.P. Freely",
//     {
//       name: "Jacques Strap",
//       email: "jacques@strap.com",
//       url: "https://strap.com",
//     },
//   ]);
// });

// test("org with contributors in constructor and added", () => {
//   const organisational = new Organisational({
//     organisation: {
//       name: "test-organisation",
//       email: "test@test.com",
//       url: "https://test.com",
//     },
//     contributors: ["I.P. Freely"],
//   });
//   const project = new NodeProject({
//     ...organisational.nodeProjectOptions(),
//     outdir: mkdtemp(),
//     name: "test-project",
//     defaultReleaseBranch: "main",
//   });
//   organisational.addToProject(project);
//   organisational.addContributors({
//     name: "Jacques Strap",
//     email: "jacques@strap.com",
//     url: "https://strap.com",
//   });
//   const snapshot = synthSnapshot(project);

//   expect(snapshot["package.json"].author.name).toEqual("test-organisation");
//   expect(snapshot["package.json"].author.email).toEqual("test@test.com");
//   expect(snapshot["package.json"].author.url).toEqual("https://test.com");
//   expect(snapshot["package.json"].contributors).toEqual([
//     "I.P. Freely",
//     {
//       name: "Jacques Strap",
//       email: "jacques@strap.com",
//       url: "https://strap.com",
//     },
//   ]);
// });

test("org with JsiiProject", () => {
  const organisational = new Organisational({
    organisation: {
      name: "test-organisation",
      email: "test@test.com",
      url: "https://test.com",
    },
  });
  const project = new JsiiProject({
    ...organisational.jsiiProjectOptions(),
    outdir: mkdtemp(),
    name: "test-project",
    defaultReleaseBranch: "main",
    repositoryUrl: "https://githab.com/test-organisation/test-project",
  });
  organisational.addToProject(project);
  const snapshot = synthSnapshot(project);

  expect(snapshot["package.json"].author.name).toEqual("test-organisation");
  expect(snapshot["package.json"].author.email).toEqual("test@test.com");
  expect(snapshot["package.json"].contributors).toBeUndefined();

  // I'm not sure why, but Jsii does not let you set the author URL
  expect(snapshot["package.json"].author.url).toBeUndefined();
});
