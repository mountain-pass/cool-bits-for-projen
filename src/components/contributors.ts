import child_process from "child_process";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import shell from "shelljs";
import "shelljs-plugin-authors";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
import { Entity } from "./organisational";
/**
 * Contributors options
 */
export type ContributorsOptions = {
  contributors?: boolean;
  autoPopulateFromGit?: boolean;
  additionalContributors?: (string | Entity)[];
};
/**
 * The `Contributors` component adds contributor information to the project
 */
export class Contributors extends Component {
  static defaultOptions: DeepRequired<ContributorsOptions> = {
    contributors: true,
    autoPopulateFromGit: true,
    additionalContributors: [],
  };
  contributors: Set<string | Entity>;
  options: DeepRequired<ContributorsOptions>;
  nodeProject: NodeProject;
  //options: ContributorsOptions;
  /**
   * creates the contributors component
   *
   * @param project the project to add to
   * @param options options
   */
  constructor(
    project: NodeProject,
    options?: Dynamic<ContributorsOptions, NodeProject>
  ) {
    super(project);
    this.nodeProject = project;
    this.options = resolve(project, options, Contributors.defaultOptions);
    if (this.options.autoPopulateFromGit) {
      const authors = (shell as any).authors();
      this.contributors = new Set<string | Entity>([
        ...this.options.additionalContributors,
        ...authors.stdout.split("\n"),
      ]);
      if (process.env.CI) {
        this.contributors.add(
          `${child_process
            .execSync("git config user.name")
            .toString()
            .trim()} <${child_process
            .execSync("git config user.email")
            .toString()
            .trim()}>`
        );
      }
    } else {
      this.contributors = new Set<string | Entity>(
        this.options.additionalContributors
      );
    }
  }

  /**
   * adds the contributors to the package.json file.
   */
  preSynthesize(): void {
    if (this.options.contributors && this.contributors.size > 0) {
      this.nodeProject.package.addField("contributors", [...this.contributors]);
    }
  }

  /**
   * adds contributors to the project
   *
   * @param {...any} contributors the contributors to add
   */
  addContributors(...contributors: (string | Entity)[]): void {
    this.contributors = new Set([...this.contributors, ...contributors]);
  }
}
