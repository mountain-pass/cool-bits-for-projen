import { Component, Project } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { CSpellOptions } from "..";
import { Dynamic } from "../util/dynamic";
import { Commitlint, CommitlintOptions } from "./commitlint";
import { Contributors, ContributorsOptions } from "./contributors";
import { CSpell } from "./cspell";
import { EslintIgnore, EslintIgnoreOptions } from "./eslint-ignore";
import { EslintJsdoc, EslintJsdocOptions } from "./eslint-jsdoc";
import { EslintJsonC, EslintJsonCOptions } from "./eslint-jsonc";
import { EslintNoSecrets, EslintNoSecretsOptions } from "./eslint-no-secrets";
import {
  EslintPrettierFixer,
  EslintPrettierFixerOptions,
} from "./eslint-prettier-fixer";
import { EslintUnicorn, EslintUnicornOptions } from "./eslint-unicorn";
import { Husky, HuskyOptions } from "./husky";
import {
  VscodeExtensionRecommendations,
  VscodeExtensionRecommendationsOptions,
} from "./vscode-extension-recommendations";
import { VscodeSettings, VscodeSettingsOptions } from "./vscode-settings";

/**
 * option to enable or disable unicorn in eslint
 */
export type RecommendedOptions = Dynamic<
  EslintPrettierFixerOptions,
  TypeScriptProject
> &
  Dynamic<EslintUnicornOptions, TypeScriptProject> &
  Dynamic<HuskyOptions, NodeProject> &
  Dynamic<CommitlintOptions, NodeProject> &
  Dynamic<VscodeExtensionRecommendationsOptions, Project> &
  Dynamic<EslintJsdocOptions, TypeScriptProject> &
  Dynamic<CSpellOptions, NodeProject> &
  Dynamic<ContributorsOptions, NodeProject> &
  Dynamic<EslintNoSecretsOptions, TypeScriptProject> &
  Dynamic<EslintJsonCOptions, TypeScriptProject> &
  Dynamic<VscodeSettingsOptions, Project> &
  Dynamic<EslintIgnoreOptions, Project>;

/**
 * adds MountainPass recommended settings to the project
 */
export class Recommended extends Component {
  static defaultProjectOptions = {
    ...EslintPrettierFixer.defaultProjectOptions,
    ...EslintUnicorn.defaultProjectOptions,
    ...EslintJsdoc.defaultProjectOptions,
    ...EslintNoSecrets.defaultProjectOptions,
    ...EslintJsonC.defaultProjectOptions,
    ...EslintIgnore.defaultProjectOptions,
  };
  static defaultOptions: RecommendedOptions = {
    ...EslintPrettierFixer.defaultOptions,
    ...EslintUnicorn.defaultOptions,
    ...Husky.defaultOptions,
    ...Commitlint.defaultOptions,
    ...VscodeExtensionRecommendations.defaultOptions,
    ...EslintJsdoc.defaultOptions,
    ...CSpell.defaultOptions,
    ...Contributors.defaultOptions,
    ...EslintNoSecrets.defaultOptions,
    ...EslintJsonC.defaultOptions,
    ...VscodeSettings.defaultOptions,
    ...EslintIgnore.defaultOptions,
  };
  eslintPrettier: EslintPrettierFixer;
  eslintUnicorn: EslintUnicorn;
  husky: Husky;
  commitlint: Commitlint;
  vscodeExtensionRecommendations: VscodeExtensionRecommendations;
  eslintJsdoc: EslintJsdoc;
  cSpell: CSpell;
  contributors: Contributors;
  eslintNoSecrets: EslintNoSecrets;
  eslintJsonC: EslintJsonC;
  vscodeSettings: VscodeSettings;
  eslintIgnore: EslintIgnore;
  /**
   * adds MountainPass recommended settings to the project
   *
   * @param project the project to add to
   * @param options - see `EslintUnicornOptions`
   */
  constructor(project: TypeScriptProject, options?: RecommendedOptions) {
    super(project);
    this.vscodeSettings = new VscodeSettings(project, options);
    this.cSpell = new CSpell(project, options);
    this.commitlint = new Commitlint(project, options);
    this.eslintPrettier = new EslintPrettierFixer(project, options);
    this.eslintIgnore = new EslintIgnore(project, options);
    this.eslintUnicorn = new EslintUnicorn(project, options);
    this.eslintJsdoc = new EslintJsdoc(project, options);
    this.eslintJsonC = new EslintJsonC(project, options);
    this.eslintNoSecrets = new EslintNoSecrets(project, options);
    this.contributors = new Contributors(project, options);
    this.vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
      project,
      options
    );
    this.husky = new Husky(project, options);
  }
}

/**
 * default options for recommended components
 *
 * @deprecated use Recommended.defaultOptions
 */
export const defaultRecommendedOptions = Recommended.defaultOptions;
