import { Component } from "projen";
import { NodeProjectOptions } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable prettier in eslint
 */
export type EslintPrettierFixerOptions = {
  eslintPrettierFixer?: boolean;
};
/**
 * makes sure prettier is added to the end of the eslint extends
 */
export class EslintPrettierFixer extends Component {
  static defaultProjectOptions: Required<
    Pick<NodeProjectOptions, "prettier"> &
      Pick<TypeScriptProjectOptions, "eslint">
  > = {
    prettier: true,
    eslint: true,
  };
  static defaultOptions: Dynamic<
    DeepRequired<EslintPrettierFixerOptions>,
    TypeScriptProject
  > = {
    eslintPrettierFixer: true,
  };

  tsProject: TypeScriptProject;
  options: DeepRequired<EslintPrettierFixerOptions>;
  /**
   * creates a EslintPrettier component to place prettier at the end of the eslint extends
   *
   * @param project the project to add prettier to
   * @param options - see PrettierOptions
   */
  constructor(
    project: TypeScriptProject,
    options?: Dynamic<EslintPrettierFixerOptions, TypeScriptProject>
  ) {
    super(project);
    this.options = resolve(
      project,
      options,
      EslintPrettierFixer.defaultOptions
    );
    this.tsProject = project;
  }

  /**
   * Prettier needs to be last in the eslint extension list, so we
   * add this during preSynthesize
   */
  preSynthesize(): void {
    if (
      this.tsProject.eslint &&
      this.tsProject.prettier &&
      this.options.eslintPrettierFixer
    ) {
      this.tsProject.eslint.addExtends("prettier");
    }
  }
}
