import { Event, SDK_VERSION } from 'csii-sentry-node';
import { addExceptionMechanism } from 'csii-sentry-utils';
import * as domain from 'domain';

/**
 * Event processor that will override SDK details to point to the serverless SDK instead of Node,
 * as well as set correct mechanism type, which should be set to `handled: false`.
 * We do it like this, so that we don't introduce any side-effects in this module, which makes it tree-shakeable.
 * @param event Event
 * @param integration Name of the serverless integration ('AWSLambda', 'GCPFunction', etc)
 */
export function serverlessEventProcessor(integration: string): (event: Event) => Event {
  return event => {
    event.sdk = {
      ...event.sdk,
      name: 'sentry.javascript.serverless',
      integrations: [...((event.sdk && event.sdk.integrations) || []), integration],
      packages: [
        ...((event.sdk && event.sdk.packages) || []),
        {
          name: 'npm:csii-sentry-serverless',
          version: SDK_VERSION,
        },
      ],
      version: SDK_VERSION,
    };

    addExceptionMechanism(event, {
      handled: false,
    });

    return event;
  };
}

/**
 * @returns Current active domain with a correct type.
 */
export function getActiveDomain(): domain.Domain | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  return (domain as any).active as domain.Domain | null;
}

/**
 * @param fn function to run
 * @returns function which runs in the newly created domain or in the existing one
 */
export function domainify<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  return (...args) => {
    if (getActiveDomain()) {
      return fn(...args);
    }
    const dom = domain.create();
    return dom.run(() => fn(...args));
  };
}

/**
 * @param source function to be wrapped
 * @param wrap wrapping function that takes source and returns a wrapper
 * @param overrides properties to override in the source
 * @returns wrapped function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function proxyFunction<A extends any[], R, F extends (...args: A) => R>(
  source: F,
  wrap: (source: F) => F,
  overrides?: Record<PropertyKey, unknown>,
): F {
  const wrapper = wrap(source);
  const handler: ProxyHandler<F> = {
    apply: <T>(_target: F, thisArg: T, args: A) => {
      return wrapper.apply(thisArg, args);
    },
  };

  if (overrides) {
    handler.get = (target, prop) => {
      // eslint-disable-next-line no-prototype-builtins
      if (overrides.hasOwnProperty(prop)) {
        return overrides[prop as string];
      }
      return (target as Record<PropertyKey, unknown>)[prop as string];
    };
  }

  return new Proxy(source, handler);
}
