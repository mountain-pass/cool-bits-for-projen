import { UserConfig } from "@commitlint/types";
import { Component, JsonFile } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
import { CSpell } from "./cspell";
import { Husky } from "./husky";
import { VscodeExtensionRecommendations } from "./vscode-extension-recommendations";

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
   * @param dependencies components that Commitlint depends on
   * @param dependencies.husky used to add a commitlint commit-msg hook
   * @param dependencies.vscodeExtensionRecommendations used to add vscode commitlint editor plugin recommendation
   * @param dependencies.cSpell used to add words to the dictionary
   */
  constructor(
    project: NodeProject,
    options?: Dynamic<CommitlintOptions, NodeProject>,
    dependencies?: {
      husky?: Husky;
      vscodeExtensionRecommendations?: VscodeExtensionRecommendations;
      cSpell?: CSpell;
    }
  ) {
    super(project);
    this.options = resolve(project, options, Commitlint.defaultOptions);
    if (this.options.commitlint) {
      project.addDevDeps("@commitlint/config-conventional", "@commitlint/cli");
      this.commitlintrc = new JsonFile(project, ".commitlintrc.json", {
        obj: this.options.commitlintOptions,
      });
      dependencies?.husky?.addHook(
        "commit-msg",
        'npx --no -- commitlint --edit "${1}"'
      );
      dependencies?.vscodeExtensionRecommendations?.addRecommendations(
        "adam-bender.commit-message-editor"
      );
      dependencies?.cSpell?.addWords("commitlint");
    }
  }
}
