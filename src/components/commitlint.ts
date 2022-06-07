import { UserConfig } from "@commitlint/types";
import { Component, JsonFile } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
import { CSpell } from "./cspell";
import { Husky } from "./husky";
import { VscodeExtensionRecommendations } from "./vscode-extension-recommendations";

/**
 * option to enable or disable commitlint
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
 * The `Commitlint` component adds [conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint) to
 * your project, which checks if your commit messages meet the [conventional commit format](https://conventionalcommits.org/).
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
    options?: Dynamic<CommitlintOptions, NodeProject>
  ) {
    super(project);
    this.options = resolve(project, options, Commitlint.defaultOptions);
    if (this.options.commitlint) {
      project.addDevDeps("@commitlint/config-conventional", "@commitlint/cli");
    }
  }

  /**
   * Called before synthesis.
   */
  preSynthesize(): void {
    if (this.options.commitlint) {
      this.commitlintrc = new JsonFile(this.project, ".commitlintrc.json", {
        obj: this.options.commitlintOptions,
      });
      for (const component of this.project.components) {
        if (component instanceof CSpell) {
          component.addWords("commitlint");
        }
        if (component instanceof Husky) {
          component.addHook(
            "commit-msg",
            'npx --no -- commitlint --edit "${1}"'
          );
        }
        if (component instanceof VscodeExtensionRecommendations) {
          component.addRecommendations("adam-bender.commit-message-editor");
        }
      }
    }
  }
}
