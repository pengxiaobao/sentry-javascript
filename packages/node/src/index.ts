export {
  Breadcrumb,
  BreadcrumbHint,
  Request,
  SdkInfo,
  Event,
  EventHint,
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
  addGlobalEventProcessor,
  addBreadcrumb,
  captureException,
  captureEvent,
  captureMessage,
  configureScope,
  getHubFromCarrier,
  getCurrentHub,
  Hub,
  makeMain,
  Scope,
  startTransaction,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  withScope,
} from 'csii-sentry-core';

export { NodeBackend, NodeOptions } from './backend';
export { NodeClient } from './client';
export { defaultIntegrations, init, lastEventId, flush, close } from './sdk';
export { SDK_NAME, SDK_VERSION } from './version';

import { Integrations as CoreIntegrations } from 'csii-sentry-core';
import { getMainCarrier } from 'csii-sentry-hub';
import * as domain from 'domain';

import * as Handlers from './handlers';
import * as NodeIntegrations from './integrations';
import * as Transports from './transports';

const INTEGRATIONS = {
  ...CoreIntegrations,
  ...NodeIntegrations,
};

export { INTEGRATIONS as Integrations, Transports, Handlers };

// We need to patch domain on the global __SENTRY__ object to make it work for node in cross-platform packages like
// csii-sentry-hub. If we don't do this, browser bundlers will have troubles resolving `require('domain')`.
const carrier = getMainCarrier();
if (carrier.__SENTRY__) {
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  carrier.__SENTRY__.extensions.domain = carrier.__SENTRY__.extensions.domain || domain;
}
