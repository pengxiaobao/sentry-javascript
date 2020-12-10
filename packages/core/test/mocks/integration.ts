import { getCurrentHub } from '@sentry-csii/hub';
import { configureScope } from '@sentry-csii/minimal';
import { Event, Integration } from '@sentry-csii/types';

export class TestIntegration implements Integration {
  public static id: string = 'TestIntegration';

  public name: string = 'TestIntegration';

  public setupOnce(): void {
    configureScope(scope => {
      scope.addEventProcessor((event: Event) => {
        if (!getCurrentHub().getIntegration(TestIntegration)) {
          return event;
        }

        return null;
      });
    });
  }
}
