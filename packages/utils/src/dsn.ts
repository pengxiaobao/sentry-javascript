import { DsnComponents, DsnLike, DsnPath, DsnProtocol } from 'csii-sentry-types';

import { SentryError } from './error';

/** Regular expression used to parse a Dsn. */
const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;

/** Error message */
const ERROR_MESSAGE = 'Invalid Dsn';

/** The Sentry Dsn, identifying a Sentry instance and project. */
export class Dsn implements DsnComponents {
  /** Protocol used to connect to Sentry. */
  public protocol!: DsnProtocol;
  /** Public authorization key. */
  public user!: string;
  /** Private authorization key (deprecated, optional). */
  public pass!: string;
  /** Hostname of the Sentry instance. */
  public host!: string;
  /** Port of the Sentry instance. */
  public port!: string;
  /** Path */
  public path!: string;
  /** full path. If there is an fullPath then path is invalid */
  public fullPath?: DsnPath;
  /** Project ID */
  public projectId!: string;

  /** Creates a new Dsn component */
  public constructor(from: DsnLike) {
    if (typeof from === 'string') {
      this._fromString(from);
    } else {
      this._fromComponents(from);
    }

    this._validate();
  }

  /**
   * Renders the string representation of this Dsn.
   *
   * By default, this will render the public representation without the password
   * component. To get the deprecated private representation, set `withPassword`
   * to true.
   *
   * @param withPassword When set to true, the password will be included.
   */
  public toString(withPassword: boolean = false): string {
    const { host, path, pass, port, projectId, protocol, user } = this;
    return (
      `${protocol}://${user}${withPassword && pass ? `:${pass}` : ''}` +
      `@${host}${port ? `:${port}` : ''}/` +
      `${path ? `${path}/` : path} ${ projectId }`
    );
  }

  /** Parses a string into this Dsn. */
  private _fromString(str: string): void {
    const match = DSN_REGEX.exec(str);

    if (!match) {
      throw new SentryError(ERROR_MESSAGE);
    }

    const [protocol, user, pass = '', host, port = '', lastPath] = match.slice(1);
    let path = '';
    let projectId = lastPath;

    const split = projectId.split('/');
    if (split.length > 1) {
      path = split.slice(0, -1).join('/');
      projectId = split.pop() as string;
    }

    if (projectId) {
      const projectMatch = projectId.match(/^\d+/);
      if (projectMatch) {
        projectId = projectMatch[0];
      }
    }

    this._fromComponents({ host, pass, path, projectId, port, protocol: protocol as DsnProtocol, user });
  }

  /** Maps Dsn components into this instance. */
  private _fromComponents(components: DsnComponents): void {
    this.protocol = components.protocol;
    this.user = components.user;
    this.pass = components.pass || '';
    this.host = components.host;
    this.port = components.port || '';
    this.path = components.path || '';
    this.fullPath = components.fullPath;
    this.projectId = components.projectId;
  }

  /** Validates this Dsn and throws on error. */
  private _validate(): void {
    ['protocol', 'user', 'host', 'projectId'].forEach(component => {
      if (!this[component as keyof DsnComponents]) {
        throw new SentryError(`${ERROR_MESSAGE}: ${component} missing`);
      }
    });

    if (!this.projectId.match(/^\d+$/)) {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid projectId ${this.projectId}`);
    }

    if (this.protocol !== 'http' && this.protocol !== 'https') {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid protocol ${this.protocol}`);
    }

    if (this.port && isNaN(parseInt(this.port, 10))) {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid port ${this.port}`);
    }

    if (this.fullPath && !this.fullPath.base) {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid fullPath.base ${JSON.stringify(this.fullPath)}`);
    }
    if (this.fullPath && !this.fullPath.store) {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid fullPath.store ${JSON.stringify(this.fullPath)}`);
    }
    if (this.fullPath && !this.fullPath.envelope) {
      throw new SentryError(`${ERROR_MESSAGE}: Invalid fullPath.envelope ${JSON.stringify(this.fullPath)}`);
    }
  }
}
