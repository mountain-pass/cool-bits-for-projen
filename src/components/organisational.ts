import { JsiiProjectOptions } from "projen/lib/cdk";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { PseudoComponent } from "../util/pseudo-component";

/**
 * a person or a organisation
 */
export type Entity = {
  name: string;
  email: string;
  url?: string;
};

/**
 * Organisational options
 */
export type OrganisationalOptions = {
  organisation: Entity;
};
/**
 * The `Organisational` pseudo-component add organisation based author data to
 * and contributors the project.
 */
export class Organisational extends PseudoComponent<NodeProject> {
  options: Required<OrganisationalOptions>;
  /**
   * creates the organisational pseudo-component
   *
   * @param options the organisation and contributors
   */
  constructor(options: OrganisationalOptions) {
    super();
    this.options = options;
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  nodeProjectOptions(): Pick<
    NodeProjectOptions,
    "authorOrganization" | "authorName" | "authorEmail" | "authorUrl"
  > {
    return {
      authorOrganization: true,
      authorName: this.options.organisation.name,
      authorEmail: this.options.organisation.email,
      authorUrl: this.options.organisation.url,
    };
  }

  /**
   * returns the organisation related options that can then be passed into a NodeProject's constructor
   *
   * @returns the options
   */
  jsiiProjectOptions(): Pick<
    NodeProjectOptions,
    "authorOrganization" | "authorName" | "authorEmail"
  > &
    Pick<JsiiProjectOptions, "author" | "authorAddress"> {
    return {
      authorOrganization: true,
      authorName: this.options.organisation.name,
      authorEmail: this.options.organisation.email,
      author: this.options.organisation.name,
      authorAddress: this.options.organisation.email,
    };
  }
}
