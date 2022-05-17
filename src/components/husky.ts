import { Component, TextFile } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { DeepRequired } from "../util/deep-required";
import { Dynamic, resolve } from "../util/dynamic";
/**
 * see https://git-scm.com/docs/githooks
 */
export type HuskyHook =
  | "applypatch-msg"
  | "pre-applypatch"
  | "post-applypatch"
  | "pre-commit"
  | "pre-merge-commit"
  | "prepare-commit-msg"
  | "commit-msg"
  | "post-commit"
  | "pre-rebase"
  | "post-checkout"
  | "post-merge"
  | "pre-push"
  | "pre-receive"
  | "update"
  | "proc-receive"
  | "post-receive"
  | "post-update"
  | "reference-transaction"
  | "push-to-checkout"
  | "pre-auto-gc"
  | "post-rewrite"
  | "sendemail-validate"
  | "fsmonitor-watchman"
  | "p4-changelist"
  | "p4-prepare-changelist"
  | "p4-post-changelist"
  | "p4-pre-submit"
  | "post-index-change";

/**
 * option to enable or disable husky and commands to run for each hook
 */
export type HuskyOptions = {
  /**
   * enable or disable husky
   *
   * @default true
   */
  husky?: boolean;
  huskyHooks?: Partial<Record<HuskyHook, string[]>>;
};

/**
 * adds husky to the project, which manages git hooks
 *
 * see https://typicode.github.io/ and https://git-scm.com/docs/githooks
 */
export class Husky extends Component {
  static defaultOptions: Dynamic<DeepRequired<HuskyOptions>, NodeProject> = {
    husky: true,
    huskyHooks: {
      "applypatch-msg": [],
      "pre-applypatch": [],
      "post-applypatch": [],
      "pre-commit": [],
      "pre-merge-commit": [],
      "prepare-commit-msg": [],
      "commit-msg": [],
      "post-commit": [],
      "pre-rebase": [],
      "post-checkout": [],
      "post-merge": [],
      "pre-push": (project: NodeProject) => {
        const lines = ["npm run test"];
        if (project instanceof TypeScriptProject && project.eslint) {
          lines.push("npm run eslint");
        }
        return lines;
      },
      "pre-receive": [],
      update: [],
      "proc-receive": [],
      "post-receive": [],
      "post-update": [],
      "reference-transaction": [],
      "push-to-checkout": [],
      "pre-auto-gc": [],
      "post-rewrite": [],
      "sendemail-validate": [],
      "fsmonitor-watchman": [],
      "p4-changelist": [],
      "p4-prepare-changelist": [],
      "p4-post-changelist": [],
      "p4-pre-submit": [],
      "post-index-change": [],
    },
  };
  options: DeepRequired<HuskyOptions>;
  hooks?: Partial<Record<HuskyHook, TextFile>>;

  /**
   * adds husky to the project
   *
   * @param project the project to add to
   * @param options - see `HuskyOptions`
   */
  constructor(
    project: NodeProject,
    options?: Dynamic<HuskyOptions, NodeProject>
  ) {
    super(project);
    this.options = resolve(project, options, Husky.defaultOptions);
    if (this.options.husky) {
      project.addDevDeps("husky");
      project.addTask("prepare", {
        exec: "husky install",
        description: "installs husky",
      });
    }
  }

  /**
   * adds husky to the project
   */
  preSynthesize(): void {
    if (this.options.husky) {
      this.hooks = {};
      for (const hookName in this.options.huskyHooks) {
        const hooks = this.options.huskyHooks[hookName as HuskyHook];
        if (hooks.length > 0) {
          this.hooks[hookName as HuskyHook] = new TextFile(
            this.project,
            `.husky/${hookName}`,
            {
              lines: ["#!/bin/sh", '. "$(dirname "$0")/_/husky.sh"', ...hooks],
              executable: true,
              marker: true,
            }
          );
        }
      }
    }
  }

  /**
   * adds the lines to the specified hook
   *
   * @param hook to hook to add to
   * @param {...any} lines the new lines to add
   */
  addHook(hook: HuskyHook, ...lines: string[]): void {
    this.options.huskyHooks[hook].push(...lines);
  }

  /**
   * replaces the specified hook
   *
   * @param hook the hook to override
   * @param {...any} lines the new lines
   */
  overrideHook(hook: HuskyHook, ...lines: string[]): void {
    this.options.huskyHooks[hook] = lines;
  }

  /**
   * removes the specified hook
   *
   * @param hook the hook to delete
   */
  deleteHook(hook: HuskyHook): void {
    this.options.huskyHooks[hook] = [];
  }
}
