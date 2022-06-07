import { Component } from "projen";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable noSecrets in eslint
 */
export type EslintNoSecretsOptions = {
  /**
   * enable or disable noSecrets in eslint
   *
   * @default true
   */
  eslintNoSecrets?: boolean;
};

/**
 * adds noSecrets to eslint if neither eslint nor eslintNoSecrets are disabled
 */
export class EslintNoSecrets extends Component {
  static defaultProjectOptions: Required<
    Pick<TypeScriptProjectOptions, "eslint">
  > = {
    eslint: true,
  };
  static defaultOptions: Dynamic<
    DeepRequired<EslintNoSecretsOptions>,
    TypeScriptProject
  > = {
    eslintNoSecrets: true,
  };

  options: DeepRequired<EslintNoSecretsOptions>;
  /**
   * adds noSecrets to eslint if neither eslint nor eslintNoSecrets are disabled
   *
   * @param project the project to add to
   * @param options - see `EslintNoSecretsOptions`
   */
  constructor(
    project: TypeScriptProject,
    options?: Dynamic<EslintNoSecretsOptions, TypeScriptProject>
  ) {
    super(project);
    this.options = resolve(project, options, EslintNoSecrets.defaultOptions);

    if (project.eslint && this.options.eslintNoSecrets) {
      project.addDevDeps("eslint-plugin-no-secrets");
      project.eslint.addPlugins("no-secrets");
      project.eslint.addRules({
        "no-secrets/no-secrets": "error",
      });
    }
  }
}
