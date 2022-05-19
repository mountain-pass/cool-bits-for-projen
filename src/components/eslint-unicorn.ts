import { Component } from "projen";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable unicorn in eslint
 */
export type EslintUnicornOptions = {
  /**
   * enable or disable unicorn in eslint
   *
   * @default true
   */
  eslintUnicorn?: boolean;
};

/**
 * adds unicorn to eslint if neither eslint nor eslintUnicorn are disabled
 */
export class EslintUnicorn extends Component {
  static defaultProjectOptions: Required<
    Pick<TypeScriptProjectOptions, "eslint">
  > = {
    eslint: true,
  };
  static defaultOptions: Dynamic<
    DeepRequired<EslintUnicornOptions>,
    TypeScriptProject
  > = {
    eslintUnicorn: true,
  };

  options: DeepRequired<EslintUnicornOptions>;
  /**
   * adds unicorn to eslint if neither eslint nor eslintUnicorn are disabled
   *
   * @param project the project to add to
   * @param options - see `EslintUnicornOptions`
   */
  constructor(
    project: TypeScriptProject,
    options?: Dynamic<EslintUnicornOptions, TypeScriptProject>
  ) {
    super(project);
    this.options = resolve(project, options, EslintUnicorn.defaultOptions);

    if (project.eslint && this.options.eslintUnicorn) {
      project.addDevDeps("eslint-plugin-unicorn");
      project.eslint.addPlugins("unicorn");
      project.eslint.addExtends("plugin:unicorn/recommended");
      project.eslint.addRules({
        "unicorn/prefer-node-protocol": "off",
      });
      project.eslint.addOverride({
        files: [".projenrc.js", ".projenrc.ts"],
        rules: {
          "unicorn/prefer-module": "off",
        },
      });
    }
  }
}
