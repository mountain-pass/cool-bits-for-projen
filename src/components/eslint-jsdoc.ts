import { Component } from "projen";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable jsdoc linting in eslint
 */
export type EslintJsdocOptions = {
  /**
   * enable or disable jsdoc in eslint
   *
   * @default true
   */
  eslintJsdoc?: boolean;
};

/**
 * adds jsdoc linting to eslint
 */
export class EslintJsdoc extends Component {
  static defaultProjectOptions: Required<
    Pick<TypeScriptProjectOptions, "eslint">
  > = {
    eslint: true,
  };
  static defaultOptions: Dynamic<
    DeepRequired<EslintJsdocOptions>,
    TypeScriptProject
  > = {
    eslintJsdoc: true,
  };

  options: DeepRequired<EslintJsdocOptions>;
  /**
   * adds jsdoc to eslint if neither eslint nor eslintUnicorn are disabled
   *
   * @param project the project to add to
   * @param options - see `EslintUnicornOptions`
   */
  constructor(
    project: TypeScriptProject,
    options?: Dynamic<EslintJsdocOptions, TypeScriptProject>
  ) {
    super(project);
    this.options = resolve(project, options, EslintJsdoc.defaultOptions);

    if (project.eslint && this.options.eslintJsdoc) {
      project.addDevDeps(
        "eslint-plugin-jsdoc",
        "eslint-plugin-jsdoc-typescript"
      );
      project.eslint.addPlugins("jsdoc");
      project.eslint.addPlugins("jsdoc-typescript");
      project.eslint.addExtends("plugin:jsdoc/recommended");
      project.eslint.addRules({
        "jsdoc/require-jsdoc": [
          "error",
          {
            contexts: [
              "TSInterfaceDeclaration",
              "TSTypeAliasDeclaration",
              "TSEnumDeclaration",
              "PropertyDeclaration",
              "ClassProperty",
              "ClassDeclaration",
              "MethodDefinition",
            ],
          },
        ],
        "jsdoc/require-description": ["error", { contexts: ["any"] }],
        "jsdoc/check-indentation": "error",
        "jsdoc/check-line-alignment": "error",
        "jsdoc/check-syntax": "error",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-param-type": "off", // TypeScript already has parameter types
        "jsdoc/require-param-description": "error",
        "jsdoc/require-returns-type": "off", // TypeScript already has return types
        // "jsdoc-typescript/require-class-field": "error",
        // "jsdoc-typescript/require-constructor-property": "error",
      });
    }
  }
}
