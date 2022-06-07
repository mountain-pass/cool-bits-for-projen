import { CSpellSettings } from "@cspell/cspell-types";
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
  cSpellOptions?: CSpellSettings;
};

/**
 * like CSpellOptions but with required fields
 */
type RequiredCSpellOptions = Required<Omit<CSpellOptions, "cSpellOptions">> & {
  cSpellOptions: Omit<CSpellSettings, "words" | "dictionaryDefinitions"> &
    Required<Pick<CSpellSettings, "words" | "dictionaryDefinitions">>;
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

  /**
   * adds cSpell to the project
   *
   * @param project the project to add to
   * @param options - see `CommitLintOptions`
   */
  constructor(
    project: NodeProject,
    options?: Dynamic<CSpellOptions, NodeProject>
  ) {
    super(project);
    this.options = resolve(project, options, CSpell.defaultOptions);
    if (this.options.cSpell) {
      project.addDevDeps("cspell");
      // add a spell checker task
      const spellCheckTask = project.addTask("spellcheck", {
        description: "check all the files for spelling errors",
        steps: [
          {
            exec: 'cspell lint --gitignore --dot --show-suggestions -e ".git/**" "**"',
          },
        ],
      });
      project.testTask.spawn(spellCheckTask);
    }
  }

  /**
   * Called before synthesis.
   */
  preSynthesize(): void {
    if (this.options.cSpell) {
      const words = new Set<string>([
        ...this.project.deps.all
          .map((dep) => dep.name)
          .flatMap((name) => name.split("/"))
          .map((name) => name.replace(/^@/, "")),
        ...this.options.cSpellOptions.words,
      ]);

      for (const component of this.project.components) {
        if (component instanceof Husky) {
          // check spelling on commit
          component.addHook(
            "pre-commit",
            "git diff --name-only --staged | npx cspell lint --dot --gitignore --show-suggestions --no-must-find-files --file-list stdin"
          );

          // adds spell checking of the commit message
          component.addHook(
            "commit-msg",
            'npx --no -- cspell lint --show-suggestions "${1}"'
          );
          for (const word of component.getHookNames()) {
            words.add(word);
          }
        }
        if (component instanceof VscodeExtensionRecommendations) {
          // adds spell checker to vscode extension recommendations
          component.addRecommendations("streetsidesoftware.code-spell-checker");
          for (const word of component
            .getRecommendations()
            .flatMap((recommendation) => recommendation.split("."))) {
            words.add(word);
          }
        }
      }

      this.options.cSpellOptions.words = [...words];
      this.options.cSpellOptions.ignorePaths = [
        ...(this.options.cSpellOptions.ignorePaths || []),
        ...this.project.files.map((file) => file.path),
        ".cspell.json",
      ];
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
