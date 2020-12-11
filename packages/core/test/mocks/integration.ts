import { getCurrentHub } from 'csii-sentry-hub';
import { configureScope } from 'csii-sentry-minimal';
import { Event, Integration } from 'csii-sentry-types';

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
