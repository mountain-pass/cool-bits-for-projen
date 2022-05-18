import { Component, Project } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { CSpellOptions } from "..";
import { Dynamic } from "../util/dynamic";
import { Commitlint, CommitlintOptions } from "./commitlint";
import { CSpell } from "./cspell";
import { EslintJsdoc, EslintJsdocOptions } from "./eslint-jsdoc";
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
  Dynamic<CSpellOptions, NodeProject>;

export const defaultRecommendedOptions: RecommendedOptions = {
  ...EslintPrettierFixer.defaultOptions,
  ...EslintUnicorn.defaultOptions,
  ...Husky.defaultOptions,
  ...Commitlint.defaultOptions,
  ...VscodeExtensionRecommendations.defaultOptions,
  ...EslintJsdoc.defaultOptions,
  ...CSpell.defaultOptions,
};

/**
 * adds MountainPass recommended settings to the project
 */
export class Recommended extends Component {
  static defaultProjectOptions = {
    ...EslintPrettierFixer.defaultProjectOptions,
    ...EslintUnicorn.defaultProjectOptions,
    ...EslintJsdoc.defaultProjectOptions,
  };
  eslintPrettier: EslintPrettierFixer;
  eslintUnicorn: EslintUnicorn;
  husky: Husky;
  commitlint: Commitlint;
  vscodeExtensionRecommendations: VscodeExtensionRecommendations;
  eslintJsdoc: EslintJsdoc;
  cSpell: CSpell;
  /**
   * adds MountainPass recommended settings to the project
   *
   * @param project the project to add to
   * @param options - see `EslintUnicornOptions`
   */
  constructor(project: TypeScriptProject, options?: RecommendedOptions) {
    super(project);
    this.eslintPrettier = new EslintPrettierFixer(project, options);
    this.eslintUnicorn = new EslintUnicorn(project, options);
    this.husky = new Husky(project, options);
    this.vscodeExtensionRecommendations = new VscodeExtensionRecommendations(
      project,
      options
    );
    this.cSpell = new CSpell(project, options, {
      husky: this.husky,
      vscodeExtensionRecommendations: this.vscodeExtensionRecommendations,
    });
    this.commitlint = new Commitlint(project, options, {
      husky: this.husky,
      vscodeExtensionRecommendations: this.vscodeExtensionRecommendations,
      cSpell: this.cSpell,
    });
    this.eslintJsdoc = new EslintJsdoc(project, options);
  }
}
