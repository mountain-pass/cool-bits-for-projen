import { UserConfig } from "@commitlint/types";
import { Component, JsonFile } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
import { Husky } from "./husky";

/**
 * option to enable or disable husky and commands to run for each hook
 */
export type CommitlintOptions = {
  /**
   * enable or disable commitlint
   *
   * @default true
   */
  commitlint?: boolean;
  commitlintOptions?: UserConfig;
};

/**
 * adds commitlint to the project
 *
 */
export class Commitlint extends Component {
  static defaultOptions: Dynamic<
    DeepRequired<Omit<CommitlintOptions, "commitlintOptions">> &
      Required<Pick<CommitlintOptions, "commitlintOptions">>,
    NodeProject
  > = {
    commitlint: true,
    commitlintOptions: { extends: ["@commitlint/config-conventional"] },
  };
  options: DeepRequired<Omit<CommitlintOptions, "commitlintOptions">> &
    Required<Pick<CommitlintOptions, "commitlintOptions">>;
  commitlintrc?: JsonFile;

  /**
   * adds commitlint to the project
   *
   * @param project the project to add to
   * @param options - see `CommitLintOptions`
   */
  constructor(
    project: NodeProject,
    husky?: Husky,
    options?: Dynamic<CommitlintOptions, NodeProject>
  ) {
    super(project);
    this.options = resolve(project, options, Commitlint.defaultOptions);
    if (this.options.commitlint) {
      project.addDevDeps("@commitlint/config-conventional", "@commitlint/cli");
      this.commitlintrc = new JsonFile(project, ".commitlintrc.json", {
        obj: this.options.commitlintOptions,
      });
      if (husky) {
        husky.addHook("commit-msg", 'npx --no -- commitlint --edit "${1}"');
      }
    }
  }
}
