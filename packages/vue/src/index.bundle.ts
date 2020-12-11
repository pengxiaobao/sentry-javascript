export {
  Breadcrumb,
  Request,
  SdkInfo,
  Event,
  Exception,
  Response,
  Severity,
  StackFrame,
  Stacktrace,
  Status,
  Thread,
  User,
} from 'csii-sentry-types';

export {
  BrowserClient,
  BrowserOptions,
  defaultIntegrations,
  forceLoad,
  lastEventId,
  onLoad,
  showReportDialog,
  flush,
  close,
  wrap,
  ReportDialogOptions,
  addGlobalEventProcessor,
  addBreadcrumb,
  captureException,
  captureEvent,
  captureMessage,
  configureScope,
  getHubFromCarrier,
  getCurrentHub,
  Hub,
  Scope,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  startTransaction,
  Transports,
  withScope,
  SDK_NAME,
  SDK_VERSION,
} from 'csii-sentry-browser';

import { Integrations as BrowserIntegrations } from 'csii-sentry-browser';
import { getGlobalObject } from 'csii-sentry-utils';

export { init } from './sdk';

let windowIntegrations = {};

// This block is needed to add compatibility with the integrations packages when used with a CDN
const _window = getGlobalObject<Window>();
if (_window.Sentry && _window.Sentry.Integrations) {
  windowIntegrations = _window.Sentry.Integrations;
}

const INTEGRATIONS = {
  ...windowIntegrations,
  ...BrowserIntegrations,
};

export { INTEGRATIONS as Integrations };
