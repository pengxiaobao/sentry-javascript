const Sentry = require('@sentry-csii/react');
const Tracing = require('@sentry-csii/tracing');

exports.onClientEntry = function(_, pluginParams) {
  if (pluginParams === undefined) {
    return;
  }

  const integrations = [...(pluginParams.integrations || [])];

  if (Tracing.hasTracingEnabled(pluginParams) && !integrations.some(ele => ele.name === 'BrowserTracing')) {
    integrations.push(new Tracing.Integrations.BrowserTracing(pluginParams.browserTracingOptions));
  }

  Tracing.addExtensionMethods();

  Sentry.init({
    environment: process.env.NODE_ENV || 'development',
    // eslint-disable-next-line no-undef
    release: __SENTRY_RELEASE__,
    // eslint-disable-next-line no-undef
    dsn: __SENTRY_DSN__,
    ...pluginParams,
    integrations,
  });

  Sentry.addGlobalEventProcessor(event => {
    event.sdk = {
      ...event.sdk,
      name: 'sentry.javascript.gatsby',
      packages: [
        ...((event.sdk && event.sdk.packages) || []),
        {
          name: 'npm:@sentry-csii/gatsby',
          version: Sentry.SDK_VERSION,
        },
      ],
      version: Sentry.SDK_VERSION,
    };
    return event;
  });
  window.Sentry = Sentry;
};
