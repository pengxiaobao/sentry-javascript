import * as Sentry from '@sentry-csii/node';
import { Integration } from '@sentry-csii/types';

import { GoogleCloudGrpc } from '../google-cloud-grpc';
import { GoogleCloudHttp } from '../google-cloud-http';
import { serverlessEventProcessor } from '../utils';

export * from './http';
export * from './events';
export * from './cloud_events';

export const defaultIntegrations: Integration[] = [
  ...Sentry.defaultIntegrations,
  new GoogleCloudHttp({ optional: true }), // We mark this integration optional since '@google-cloud/common' module could be missing.
  new GoogleCloudGrpc({ optional: true }), // We mark this integration optional since 'google-gax' module could be missing.
];

/**
 * @see {@link Sentry.init}
 */
export function init(options: Sentry.NodeOptions = {}): void {
  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = defaultIntegrations;
  }
  Sentry.init(options);
  Sentry.addGlobalEventProcessor(serverlessEventProcessor('GCPFunction'));
}
