import { Component, IgnoreFile, Project } from "projen";
import { Eslint } from "projen/lib/javascript";
import { TypeScriptProjectOptions } from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable ignore in eslint
 */
export type EslintIgnoreOptions = {
  /**
   * enable or disable creating an eslint ignore file
   *
   * @default true
   */
  eslintIgnore?: boolean;
};

/**
 * adds an .eslintignore file populated with the project's generated files
 */
export class EslintIgnore extends Component {
  static defaultProjectOptions: Required<
    Pick<TypeScriptProjectOptions, "eslint">
  > = {
    eslint: true,
  };
  static defaultOptions: Dynamic<DeepRequired<EslintIgnoreOptions>, Project> = {
    eslintIgnore: true,
  };

  options: DeepRequired<EslintIgnoreOptions>;
  ignoreFile?: IgnoreFile;
  /**
   * adds ignore to eslint if neither eslint nor eslintIgnore are disabled
   *
   * @param project the project to add to
   * @param options - see `EslintIgnoreOptions`
   */
  constructor(
    project: Project,
    options?: Dynamic<EslintIgnoreOptions, Project>
  ) {
    super(project);
    this.options = resolve(project, options, EslintIgnore.defaultOptions);
    const eslint = project.components.find(
      (component) => component instanceof Eslint
    );
    if (eslint && this.options.eslintIgnore) {
      this.ignoreFile = new IgnoreFile(project, ".eslintignore");
    }
  }

  /**
   * adds the project's generated files to the .eslintignore file
   */
  synthesize(): void {
    this.ignoreFile?.addPatterns(
      ...this.project.files.map((file) => file.path)
    );
  }
}
