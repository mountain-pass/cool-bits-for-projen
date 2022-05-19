import { CSpellUserSettings } from "@cspell/cspell-types";
import { Component, JsonFile, SampleFile } from "projen";
import { JsiiProject } from "projen/lib/cdk";
import { NodeProject } from "projen/lib/javascript";
import { Dynamic, resolve } from "../util/dynamic";
import { Husky } from "./husky";
import { VscodeExtensionRecommendations } from "./vscode-extension-recommendations";
/**
 * option to enable or disable cSpell and cSpell options
 */
export type CSpellOptions = {
  /**
   * enable or disable cSpell
   *
   * @default true
   */
  cSpell?: boolean;
  cSpellOptions?: CSpellUserSettings;
};

/**
 * like CSpellOptions but with required fields
 */
type RequiredCSpellOptions = Required<Omit<CSpellOptions, "cSpellOptions">> & {
  cSpellOptions: Omit<CSpellUserSettings, "words" | "dictionaryDefinitions"> &
    Required<Pick<CSpellUserSettings, "words" | "dictionaryDefinitions">>;
};

/**
 * adds cSpell to the project
 *
 */
export class CSpell extends Component {
  static defaultOptions: Dynamic<RequiredCSpellOptions, NodeProject> = {
    cSpell: true,
    cSpellOptions: {
      language: "en",
      words: (project: NodeProject) => {
        const words = [
          "projen",
          "projenrc",
          "mountainpass",
          "docgen",
          "unbump",
          "lcov",
          "cobertura",
        ];
        if (project instanceof JsiiProject) {
          words.push("compat", "jsii");
        }
        return words;
      },
      dictionaryDefinitions: [
        {
          name: "project-words",
          path: "./.project-words.txt",
          addWords: true,
        },
      ],
      dictionaries: ["project-words"],
    },
  };

  options: RequiredCSpellOptions;
  cSpellConfigFile?: JsonFile;
  dependencies:
    | {
        husky?: Husky | undefined;
        vscodeExtensionRecommendations?:
          | VscodeExtensionRecommendations
          | undefined;
      }
    | undefined;

  /**
   * adds cSpell to the project
   *
   * @param project the project to add to
   * @param options - see `CommitLintOptions`
   * @param dependencies components that CSpell depends on
   * @param dependencies.husky used to add a cSpell commit-msg hook
   * @param dependencies.vscodeExtensionRecommendations used to add vscode cSpell editor plugin recommendation
   */
  constructor(
    project: NodeProject,
    options?: Dynamic<CSpellOptions, NodeProject>,
    dependencies?: {
      husky?: Husky;
      vscodeExtensionRecommendations?: VscodeExtensionRecommendations;
    }
  ) {
    super(project);
    this.options = resolve(project, options, CSpell.defaultOptions);
    this.dependencies = dependencies;
    if (this.options.cSpell) {
      project.addDevDeps("cspell");
      // add a spell checker task
      project.addTask("spellcheck", {
        description: "check all the files for spelling errors",
        steps: [{ exec: 'cspell lint --gitignore --show-suggestions "**/*"' }],
      });
      // check spelling on commit
      dependencies?.husky?.addHook(
        "pre-commit",
        "git diff --name-only | npx cspell lint --gitignore --show-suggestions --file-list stdin"
      );

      // adds spell checking of the commit message
      dependencies?.husky?.addHook(
        "commit-msg",
        'npx --no -- cspell lint --show-suggestions "${1}"'
      );
      this.options.cSpellOptions.words.push(
        ...(dependencies?.husky?.getHookNames() || [])
      );
      // adds spell checker to vscode extension recommendations
      dependencies?.vscodeExtensionRecommendations?.addRecommendations(
        "streetsidesoftware.code-spell-checker"
      );
    }
  }

  /**
   * add the cspell file
   */
  preSynthesize(): void {
    if (this.options.cSpell) {
      this.options.cSpellOptions.words.push(
        ...(this.dependencies?.vscodeExtensionRecommendations
          ?.getRecommendations()
          .flatMap((recommendation) => recommendation.split(".")) || []),
        ...this.project.deps.all
          .map((dep) => dep.name)
          .flatMap((name) => name.split("/"))
          .map((name) => name.replace(/^@/, ""))
      );
      this.cSpellConfigFile = new JsonFile(this.project, ".cspell.json", {
        obj: this.options.cSpellOptions,
      });
      // normally this will be ./.project-words.txt, but users can override it
      const customDictionary =
        this.options.cSpellOptions.dictionaryDefinitions.find(
          (dictionaryDefinition) =>
            "addWords" in dictionaryDefinition && dictionaryDefinition.addWords
        );

      if (customDictionary?.path) {
        new SampleFile(this.project, customDictionary.path, { contents: " " });
      }
    }
  }

  /**
   * adds words to the dictionary
   *
   * @param {...any} words words to add to the dictionary
   */
  addWords(...words: string[]) {
    this.options.cSpellOptions.words.push(...words);
  }
}
