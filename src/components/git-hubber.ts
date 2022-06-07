import { JsiiProjectOptions } from "projen/lib/cdk";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { PseudoComponent } from "../util/pseudo-component";
import { CSpell } from "./cspell";

/**
 * GitHubber options
 */
export type GitHubberOptions = {
  /**
   * The name of the project.
   */
  name: string;
  /**
   * The github name of the user or organisation this project belongs to
   */
  username: string;
  /**
   * The homepage of the project. Defaults to the GitHub project page.
   */
  homepage?: string;
};
/**
 * The `GitHubber` pseudo-component add organisation based author data to
 * and contributors the project.
 */
export class GitHubber extends PseudoComponent<NodeProject> {
  options: Required<GitHubberOptions>;
  /**
   * creates the gitHubber pseudo-component
   *
   * @param options the organisation and contributors
   */
  constructor(options: GitHubberOptions) {
    super();
    this.options = {
      ...options,
      homepage:
        options.homepage ||
        `https://github.com/${options.username}/${options.name}`,
    };
  }

  /**
   * Called before synthesis.
   *
   * @param _project the project to apply to
   */
  preSynthesize(_project: NodeProject): void {
    for (const component of _project.components) {
      if (component instanceof CSpell) {
        component.addWords("hubber");
      }
    }
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  nodeProjectOptions(): Required<
    Pick<NodeProjectOptions, "repository" | "homepage" | "bugsUrl" | "name">
  > {
    return {
      homepage: this.options.homepage,
      repository: `https://github.com/${this.options.username}/${this.options.name}.git`,
      bugsUrl: `https://github.com/${this.options.username}/${this.options.name}/issues`,
      name: this.options.name,
    };
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  jsiiProjectOptions(): Required<
    Pick<
      JsiiProjectOptions,
      "repositoryUrl" | "repository" | "homepage" | "bugsUrl" | "name"
    >
  > {
    return {
      ...this.nodeProjectOptions(),
      repositoryUrl: `https://github.com/${this.options.username}/${this.options.name}.git`,
    };
  }
}
