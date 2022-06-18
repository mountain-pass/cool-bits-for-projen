import { Component, JsonFile, Project } from "projen";
import { Prettier } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
import { VscodeSettings } from "./vscode-settings";

/**
 * option to enable or disable jsonC in eslint
 */
export type EslintJsonCOptions = {
  /**
   * enable or disable jsonC in eslint
   *
   * @default true
   */
  eslintJsonC?: boolean;
};

/**
 * adds jsonC to eslint if neither eslint nor eslintJsonC are disabled
 */
export class EslintJsonC extends Component {
  static defaultProjectOptions: Required<
    Pick<TypeScriptProjectOptions, "eslint">
  > = {
    eslint: true,
  };
  static defaultOptions: Dynamic<
    DeepRequired<EslintJsonCOptions>,
    TypeScriptProject
  > = {
    eslintJsonC: true,
  };

  /**
   * Finds the EslintJsonC instance belonging to this project
   *
   * @param project the project to search
   * @returns the found EslintJsonC instance or undefined
   */
  static of(project: Project) {
    return project.components.find(
      (component) => component instanceof EslintJsonC
    ) as EslintJsonC | undefined;
  }

  options: DeepRequired<EslintJsonCOptions>;
  configFile?: JsonFile;
  typeScriptProject: TypeScriptProject;
  /**
   * adds jsonC to eslint if neither eslint nor eslintJsonC are disabled
   *
   * @param project the project to add to
   * @param options - see `EslintJsonCOptions`
   */
  constructor(
    project: TypeScriptProject,
    options?: Dynamic<EslintJsonCOptions, TypeScriptProject>
  ) {
    super(project);
    this.typeScriptProject = project;
    this.options = resolve(project, options, EslintJsonC.defaultOptions);

    if (project.eslint && this.options.eslintJsonC) {
      this.setupJsonLinting();
      this.setupVscodeToLintJson();
    }
  }

  /**
   * creates config file for linting JSON and adds task
   */
  private setupJsonLinting() {
    if (this.typeScriptProject.eslint && this.options.eslintJsonC) {
      this.configFile = new JsonFile(this.project, ".eslintrc-json.json", {
        obj: {
          env: {
            jest: true,
            node: true,
          },
          root: true,
          plugins: Prettier.of(this.project) ? ["prettier"] : [],
          extends: [
            "plugin:jsonc/recommended-with-jsonc",
            ...(Prettier.of(this.project) ? ["plugin:jsonc/prettier"] : []),
          ],
          ignorePatterns: [
            "*.js",
            "!.projenrc.ts",
            "*.d.ts",
            "node_modules/",
            "*.generated.ts",
            "coverage",
          ],
        },
        committed: true,
        marker: false,
      });
      const eslintJsonTask = this.project.addTask("eslint:json", {
        description: "lint all the json files",
        steps: [
          {
            exec: "eslint --no-eslintrc --no-error-on-unmatched-pattern --config .eslintrc-json.json --ext .json .",
          },
        ],
      });
      this.project.testTask.spawn(eslintJsonTask);
    }
  }

  /**
   * update .eslintrc.json to use jsonC and then tell
   * vscode to lint json files
   */
  private setupVscodeToLintJson() {
    if (this.typeScriptProject.eslint && this.options.eslintJsonC) {
      this.typeScriptProject.addDevDeps("eslint-plugin-jsonc");
      this.typeScriptProject.eslint.addExtends(
        "plugin:jsonc/recommended-with-jsonc",
        "plugin:jsonc/prettier"
      );
      this.typeScriptProject.eslint.addOverride({
        files: ["*.json", "*.json5", "*.jsonc"],
        excludedFiles: this.typeScriptProject.files.map((file) => file.path),
        parser: "jsonc-eslint-parser",
        rules: {
          "@typescript-eslint/no-floating-promises": "off",
          "@typescript-eslint/return-await": "off",
        },
      } as any);
      for (const component of this.typeScriptProject.components) {
        if (component instanceof VscodeSettings && component.settingsFile) {
          component.settingsFile.addOverride("eslint\\.validate", [
            "javascript",
            "javascriptreact",
            "json",
            "jsonc",
            "json5",
          ]);
        }
      }
    }
  }
}
