import { Project } from "projen";
import { PseudoComponent } from "../../src";
import { mkdtemp } from "./util";

/**
 * just testing
 */
class TestPseudoComponent extends PseudoComponent<Project> {
  preSynthesizeCallCount: number;
  synthesizeCallCount: number;
  postSynthesizeCallCount: number;

  /**
   * just testing
   */
  constructor() {
    super();
    this.preSynthesizeCallCount = 0;
    this.synthesizeCallCount = 0;
    this.postSynthesizeCallCount = 0;
  }

  /**
   * just testing
   *
   * @param _project just testing
   */
  preSynthesize(_project: Project): void {
    this.preSynthesizeCallCount++;
  }

  /**
   * just testing
   *
   * @param _project just testing
   */
  synthesize(_project: Project): void {
    this.synthesizeCallCount++;
  }

  /**
   * just testing
   *
   * @param _project just testing
   */
  postSynthesize(_project: Project): void {
    this.postSynthesizeCallCount++;
  }
}

test("pseudo-component", () => {
  const testPseudoComponent = new TestPseudoComponent();
  const project = new Project({ name: "test", outdir: mkdtemp() });
  testPseudoComponent.addToProject(project);
  project.synth();
  expect(testPseudoComponent.preSynthesizeCallCount).toBe(1);
  expect(testPseudoComponent.synthesizeCallCount).toBe(1);
  expect(testPseudoComponent.postSynthesizeCallCount).toBe(1);
});

/**
 * just testing
 */
class TestPseudoComponentWithoutSynthMethods extends PseudoComponent<Project> {
  /**
   * just testing
   */
  constructor() {
    super();
  }
}

test("pseudo-component without synth methods", () => {
  // just testing to make sure we done HAVE to implement these methods
  const testPseudoComponent = new TestPseudoComponentWithoutSynthMethods();
  const project = new Project({ name: "test", outdir: mkdtemp() });
  testPseudoComponent.addToProject(project);
  project.synth();
});
