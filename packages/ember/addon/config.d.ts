declare module 'ember-get-config' {
  import { BrowserOptions } from 'csii-sentry-browser';
  type EmberSentryConfig = {
    sentry: BrowserOptions;
    transitionTimeout: number;
    ignoreEmberOnErrorWarning: boolean;
    disableInstrumentComponents: boolean;
    disablePerformance: boolean;
    disablePostTransitionRender: boolean;
    disableRunloopPerformance: boolean;
    disableInitialLoadInstrumentation: boolean;
    enableComponentDefinitions: boolean;
    minimumRunloopQueueDuration: number;
    minimumComponentRenderDuration: number;
  };
  const config: {
    'csii-sentry-ember': EmberSentryConfig;
  };
  export default config;
}
