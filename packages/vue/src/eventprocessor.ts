import { addGlobalEventProcessor, SDK_VERSION } from 'csii-sentry-browser';

/**
 * A global side effect that makes sure Sentry events that user
 * `csii-sentry-react` will correctly have Sentry events associated
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
          name: 'npm:csii-sentry-vue',
          version: SDK_VERSION,
        },
      ],
      version: SDK_VERSION,
    };

    return event;
  });
}
