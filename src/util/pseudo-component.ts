import { Component, Project } from "projen";

/**
 * helper class to allow the pseudo-component to be used as a component
 */
class PseudoComponentHelper<
  ProjectType extends Project,
  PseudoComponentType extends PseudoComponent<ProjectType>
> extends Component {
  pseudoComponent: PseudoComponentType;
  /**
   * creates a pseudo-component helper
   *
   * @param project the project to add the pseudo-component to
   * @param pseudoComponent the pseudo-component to add
   */
  constructor(project: ProjectType, pseudoComponent: PseudoComponentType) {
    super(project);
    this.pseudoComponent = pseudoComponent;
  }

  /**
   * Called before synthesis.
   */
  preSynthesize(): void {
    this.pseudoComponent.preSynthesize(this.project as ProjectType);
  }

  /**
   * Synthesizes files to the project output directory.
   */
  synthesize(): void {
    this.pseudoComponent.synthesize(this.project as ProjectType);
  }

  /**
   * Called after synthesis. Order is *not* guaranteed.
   */
  postSynthesize(): void {
    this.pseudoComponent.postSynthesize(this.project as ProjectType);
  }
}

/**
 * Represents a project component, but can be constructed before the
 * project is constructed. This is needed if your component needs to
 * synthesize options to pass into the project.
 */
export abstract class PseudoComponent<ProjectType extends Project> {
  /**
   * Called before synthesis.
   *
   * @param _project the project to apply to
   */
  preSynthesize(_project: ProjectType): void {}
  /**
   * Synthesizes files to the project output directory.
   *
   * @param _project the project to apply to
   */
  synthesize(_project: ProjectType): void {}
  /**
   * Called after synthesis. Order is *not* guaranteed.
   *
   * @param _project the project to apply to
   */
  postSynthesize(_project: ProjectType): void {}

  /**
   * adds the pseudo-component to the project
   *
   * @param project the project to apply to
   */
  addToProject(project: ProjectType) {
    new PseudoComponentHelper(project, this);
  }
}
