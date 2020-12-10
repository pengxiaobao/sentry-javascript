import { addGlobalEventProcessor, getCurrentHub } from '@sentry-csii/core';
import { Event, Integration } from '@sentry-csii/types';
import { getGlobalObject } from '@sentry-csii/utils';

const global = getGlobalObject<Window>();

/** UserAgent */
export class UserAgent implements Integration {
  /**
   * @inheritDoc
   */
  public static id: string = 'UserAgent';

  /**
   * @inheritDoc
   */
  public name: string = UserAgent.id;

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    addGlobalEventProcessor((event: Event) => {
      if (getCurrentHub().getIntegration(UserAgent)) {
        // if none of the information we want exists, don't bother
        if (!global.navigator && !global.location && !global.document) {
          return event;
        }

        // grab as much info as exists and add it to the event
        const url = event.request?.url || global.location?.href;
        const { referrer } = global.document || {};
        const { userAgent } = global.navigator || {};

        const headers = {
          ...event.request?.headers,
          ...(referrer && { Referer: referrer }),
          ...(userAgent && { 'User-Agent': userAgent }),
        };
        const request = { ...(url && { url }), headers };

        return { ...event, request };
      }
      return event;
    });
  }
}
