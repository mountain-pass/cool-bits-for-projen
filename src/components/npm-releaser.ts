import {
  NodeProject,
  NodeProjectOptions,
  NpmAccess,
} from "projen/lib/javascript";
import { PseudoComponent } from "../util/pseudo-component";
import { GitHubber } from "./git-hubber";

/**
 * NpmReleaser options
 */
export type NpmReleaserOptions = {
  name: string;
  scope?: string;
  access?: NpmAccess;
  release?: boolean;
  registryUrl?: string;
  releaseTag?: string;
};
/**
 * The `NpmReleaser` pseudo-component add npm release data to
 * the project.
 */
export class NpmReleaser extends PseudoComponent<NodeProject> {
  options: NpmReleaserOptions;
  /**
   * creates the npmReleaser pseudo-component
   *
   * @param options the organisation and contributors
   */
  constructor(options: NpmReleaserOptions);

  /**
   * creates the npmReleaser pseudo-component
   *
   * @param gitHubber a GitHubber instance to base the NpmReleaser on
   * @param options additional NpmReleaser options and overrides
   */
  constructor(gitHubber: GitHubber, options?: Partial<NpmReleaserOptions>);
  /**
   * creates the npmReleaser pseudo-component
   *
   * @param gitHubberOrOptions a GitHubber instance to base the NpmReleaser on or options
   * @param options additional NpmReleaser options and overrides
   */
  constructor(
    gitHubberOrOptions: GitHubber | NpmReleaserOptions,
    options?: Partial<NpmReleaserOptions>
  ) {
    super();
    this.options =
      gitHubberOrOptions instanceof GitHubber
        ? {
            name: gitHubberOrOptions.options.name,
            scope: gitHubberOrOptions.options.username,
            ...options,
          }
        : gitHubberOrOptions;
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  nodeProjectOptions(): Pick<
    NodeProjectOptions,
    | "packageName"
    | "npmDistTag"
    | "npmAccess"
    | "releaseToNpm"
    | "npmRegistryUrl"
  > {
    return {
      packageName: this.options.scope
        ? `@${this.options.scope}/${this.options.name}`
        : this.options.name,
      npmDistTag: this.options.releaseTag,
      npmAccess: this.options.access,
      releaseToNpm: this.options.release,
      npmRegistryUrl: this.options.registryUrl,
    };
  }
}
