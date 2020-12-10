import { Client } from '@sentry-csii/types';

import { Hub } from './hub';
import { Scope } from './scope';

/**
 * A layer in the process stack.
 * @hidden
 */
export interface Layer {
  client?: Client;
  scope?: Scope;
}

/**
 * An object that contains a hub and maintains a scope stack.
 * @hidden
 */
export interface Carrier {
  __SENTRY__?: {
    hub?: Hub;
    /**
     * Extra Hub properties injected by various SDKs
     */
    extensions?: {
      /** Hack to prevent bundlers from breaking our usage of the domain package in the cross-platform Hub package */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      domain?: { [key: string]: any };
    } & {
      /** Extension methods for the hub, which are bound to the current Hub instance */
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string]: Function;
    };
  };
}

export interface DomainAsCarrier extends Carrier {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: { [key: string]: any }[];
}
