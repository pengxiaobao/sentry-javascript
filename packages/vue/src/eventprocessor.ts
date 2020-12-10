import { addGlobalEventProcessor, SDK_VERSION } from '@sentry-csii/browser';

/**
 * A global side effect that makes sure Sentry events that user
 * `@sentry-csii/react` will correctly have Sentry events associated
 * with it.
 */
export function createVueEventProcessor(): void {
  addGlobalEventProcessor(event => {
    event.sdk = {
      ...event.sdk,
      name: 'sentry.javascript.vue',
      packages: [
        ...((event.sdk && event.sdk.packages) || []),
        {
          name: 'npm:@sentry-csii/vue',
          version: SDK_VERSION,
        },
      ],
      version: SDK_VERSION,
    };

    return event;
  });
}
