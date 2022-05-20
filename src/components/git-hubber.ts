import { JsiiProjectOptions } from "projen/lib/cdk";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { PseudoComponent } from "../util/pseudo-component";
import { CSpell } from "./cspell";

/**
 * GitHubber options
 */
export type GitHubberOptions = {
  name: string;
  githubUsername: string;
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
        `https://github.com/${options.githubUsername}/${options.name}`,
    };
  }

  /**
   * attach dependencies
   *
   * @param dependencies components that gitHubber depends on
   * @param dependencies.cSpell used to add words to the dictionary
   */
  addDependencies(dependencies: { cSpell: CSpell }): void {
    if (dependencies.cSpell) {
      dependencies.cSpell.addWords("hubber");
    }
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  nodeProjectOptions(): Pick<
    NodeProjectOptions,
    "repository" | "homepage" | "bugsUrl" | "name"
  > {
    return {
      homepage: this.options.homepage,
      repository: `https://github.com/${this.options.githubUsername}/${this.options.name}.git`,
      bugsUrl: `https://github.com/${this.options.githubUsername}/${this.options.name}/issues`,
      name: this.options.name,
    };
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  jsiiProjectOptions(): Pick<
    JsiiProjectOptions,
    "repositoryUrl" | "repository" | "homepage" | "bugsUrl" | "name"
  > {
    return {
      homepage: this.options.homepage,
      repository: `https://github.com/${this.options.githubUsername}/${this.options.name}.git`,
      repositoryUrl: `https://github.com/${this.options.githubUsername}/${this.options.name}.git`,
      bugsUrl: `https://github.com/${this.options.githubUsername}/${this.options.name}/issues`,
      name: this.options.name,
    };
  }
}
