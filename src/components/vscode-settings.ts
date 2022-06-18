import { Component, JsonFile, Project } from "projen";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";

/**
 * option to enable or disable VscodeSettings and recommended extensions
 */
export type VscodeSettingsOptions = {
  /**
   * enable or disable vscodeSettings
   *
   * @default true
   */
  vscodeSettings?: boolean;

  /**
   * settings to add to vscode
   *
   * @default {}
   */
  vscodeSettingsOptions?: any;
};

/**
 * adds vscodeSettings to the project, which manages git recommendations
 *
 * see https://typicode.github.io/ and https://git-scm.com/docs/gitrecommendations
 */
export class VscodeSettings extends Component {
  static defaultOptions: Dynamic<DeepRequired<VscodeSettingsOptions>, Project> =
    {
      vscodeSettings: true,
      vscodeSettingsOptions: {},
    };
  options: DeepRequired<VscodeSettingsOptions>;
  settingsFile?: JsonFile;
  /**
   * adds vscodeSettings to the project
   *
   * @param project the project to add to
   * @param options - see `VscodeSettingsOptions`
   */
  constructor(
    project: Project,
    options?: Dynamic<VscodeSettingsOptions, Project>
  ) {
    super(project);
    this.options = resolve(project, options, VscodeSettings.defaultOptions);
    if (this.options.vscodeSettings) {
      this.settingsFile = new JsonFile(this.project, ".vscode/settings.json", {
        obj: this.options.vscodeSettingsOptions,
        committed: true,
      });
      this.project.addGitIgnore("!/.vscode/settings.json");
    }
  }
}
