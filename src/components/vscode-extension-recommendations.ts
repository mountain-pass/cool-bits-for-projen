import { Component, JsonFile, Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable VscodeExtensionRecommendations and recommended extensions
 */
export type VscodeExtensionRecommendationsOptions = {
  /**
   * enable or disable vscodeExtensionRecommendations
   *
   * @default true
   */
  vscodeExtensionRecommendations?: boolean;
  vscodeExtensionRecommendationsOptions?: {
    recommendations: string[];
  };
};

/**
 * adds vscodeExtensionRecommendations to the project, which manages git recommendations
 *
 * see https://typicode.github.io/ and https://git-scm.com/docs/gitrecommendations
 */
export class VscodeExtensionRecommendations extends Component {
  static defaultOptions: Dynamic<
    DeepRequired<VscodeExtensionRecommendationsOptions>,
    Project
  > = {
    vscodeExtensionRecommendations: true,
    vscodeExtensionRecommendationsOptions: (project: Project) => {
      const recommendations: string[] = ["MarkMcCulloh.vscode-projen"];
      if (project instanceof TypeScriptProject) {
        recommendations.push("dbaeumer.vscode-eslint");
      }
      return { recommendations };
      // recommendations: [
      //   "streetsidesoftware.code-spell-checker",
      //   ,
      //   "adam-bender.commit-message-editor",
      // ],
    },
  };
  options: DeepRequired<VscodeExtensionRecommendationsOptions>;
  extensionsRecommendationsFile?: JsonFile;
  /**
   * adds vscodeExtensionRecommendations to the project
   *
   * @param project the project to add to
   * @param options - see `VscodeExtensionRecommendationsOptions`
   */
  constructor(
    project: Project,
    options?: Dynamic<VscodeExtensionRecommendationsOptions, Project>
  ) {
    super(project);
    this.options = resolve(
      project,
      options,
      VscodeExtensionRecommendations.defaultOptions
    );
  }

  /**
   * Adds JsonFile containing the recommendations and makes
   * sure it's not git ignored
   */
  preSynthesize(): void {
    if (
      this.options.vscodeExtensionRecommendations &&
      this.options.vscodeExtensionRecommendationsOptions.recommendations
        .length > 0
    ) {
      this.extensionsRecommendationsFile = new JsonFile(
        this.project,
        ".vscode/extensions.json",
        {
          obj: this.options.vscodeExtensionRecommendationsOptions,
          committed: true,
        }
      );
      this.project.addGitIgnore("!/.vscode/extensions.json");
    }
  }

  /**
   * adds the lines to the specified recommendation
   *
   * @param recommendations the new extensions to recommend
   */
  addRecommendations(...recommendations: string[]): void {
    this.options.vscodeExtensionRecommendationsOptions.recommendations.push(
      ...recommendations
    );
  }

  /**
   * replaces the recommendations
   *
   * @param recommendations the recommendation to override
   */
  overrideRecommendations(...recommendations: string[]): void {
    this.options.vscodeExtensionRecommendationsOptions.recommendations =
      recommendations;
  }

  /**
   * removes the recommendations
   */
  deleteRecommendations(): void {
    this.options.vscodeExtensionRecommendationsOptions.recommendations = [];
  }

  /**
   * get the list of recommendations
   *
   * @returns the recommendations
   */
  getRecommendations(): string[] {
    return this.options.vscodeExtensionRecommendationsOptions.recommendations;
  }
}
