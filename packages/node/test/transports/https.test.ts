import { TransportOptions } from 'csii-sentry-types';
import { SentryError } from 'csii-sentry-utils';
import * as HttpsProxyAgent from 'https-proxy-agent';

import { HTTPSTransport } from '../../src/transports/https';

const mockSetEncoding = jest.fn();
const dsn = 'https://9e9fd4523d784609a5fc0ebb1080592f@sentry-csii.io:8989/mysubpath/50622';
const transportPath = '/mysubpath/api/50622/store/';
let mockReturnCode = 200;
let mockHeaders = {};

jest.mock('fs', () => ({
  readFileSync(): string {
    return 'mockedCert';
  },
}));

function createTransport(options: TransportOptions): HTTPSTransport {
  const transport = new HTTPSTransport(options);
  transport.module = {
    request: jest.fn().mockImplementation((_options: any, callback: any) => ({
      end: () => {
        callback({
          headers: mockHeaders,
          setEncoding: mockSetEncoding,
          statusCode: mockReturnCode,
        });
      },
      on: jest.fn(),
    })),
  };
  return transport;
}

function assertBasicOptions(options: any): void {
  expect(options.headers['X-Sentry-Auth']).toContain('sentry_version');
  expect(options.headers['X-Sentry-Auth']).toContain('sentry_client');
  expect(options.headers['X-Sentry-Auth']).toContain('sentry_key');
  expect(options.port).toEqual('8989');
  expect(options.path).toEqual(transportPath);
  expect(options.hostname).toEqual('sentry.io');
}

describe('HTTPSTransport', () => {
  beforeEach(() => {
    mockReturnCode = 200;
    mockHeaders = {};
    jest.clearAllMocks();
  });

  test('send 200', async () => {
    const transport = createTransport({ dsn });
    await transport.sendEvent({
      message: 'test',
    });

    const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
    assertBasicOptions(requestOptions);
    expect(mockSetEncoding).toHaveBeenCalled();
  });

  test('send 400', async () => {
    mockReturnCode = 400;
    const transport = createTransport({ dsn });

    try {
      await transport.sendEvent({
        message: 'test',
      });
    } catch (e) {
      const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
      assertBasicOptions(requestOptions);
      expect(e).toEqual(new SentryError(`HTTP Error (${mockReturnCode})`));
    }
  });

  test('send x-sentry-error header', async () => {
    mockReturnCode = 429;
    mockHeaders = {
      'x-sentry-error': 'test-failed',
    };
    const transport = createTransport({ dsn });

    try {
      await transport.sendEvent({
        message: 'test',
      });
    } catch (e) {
      const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
      assertBasicOptions(requestOptions);
      expect(e).toEqual(new SentryError(`HTTP Error (${mockReturnCode}): test-failed`));
    }
  });

  test('back-off using retry-after header', async () => {
    const retryAfterSeconds = 10;
    mockReturnCode = 429;
    mockHeaders = {
      'retry-after': retryAfterSeconds,
    };
    const transport = createTransport({ dsn });

    const now = Date.now();
    const mock = jest
      .spyOn(Date, 'now')
      // Check for first event
      .mockReturnValueOnce(now)
      // Setting disabledUntil
      .mockReturnValueOnce(now)
      // Check for second event
      .mockReturnValueOnce(now + (retryAfterSeconds / 2) * 1000)
      // Check for third event
      .mockReturnValueOnce(now + retryAfterSeconds * 1000);

    try {
      await transport.sendEvent({ message: 'test' });
    } catch (e) {
      expect(e).toEqual(new SentryError(`HTTP Error (${mockReturnCode})`));
    }

    try {
      await transport.sendEvent({ message: 'test' });
    } catch (e) {
      expect(e).toEqual(
        new SentryError(`Transport locked till ${new Date(now + retryAfterSeconds * 1000)} due to too many requests.`),
      );
    }

    try {
      await transport.sendEvent({ message: 'test' });
    } catch (e) {
      expect(e).toEqual(new SentryError(`HTTP Error (${mockReturnCode})`));
    }

    mock.mockRestore();
  });

  test('transport options', async () => {
    mockReturnCode = 200;
    const transport = createTransport({
      dsn,
      headers: {
        a: 'b',
      },
    });
    await transport.sendEvent({
      message: 'test',
    });

    const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
    assertBasicOptions(requestOptions);
    expect(requestOptions.headers).toEqual(expect.objectContaining({ a: 'b' }));
  });

  test('https proxy', async () => {
    mockReturnCode = 200;
    const transport = createTransport({
      dsn,
      httpsProxy: 'https://example.com:8080',
    });
    await transport.sendEvent({
      message: 'test',
    });

    const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
    assertBasicOptions(requestOptions);
    expect(requestOptions.agent).toBeInstanceOf(HttpsProxyAgent);
    expect(requestOptions.agent.secureProxy).toEqual(true);
    expect(requestOptions.agent.proxy).toEqual(
      expect.objectContaining({ protocol: 'https:', port: 8080, host: 'example.com' }),
    );
  });

  test('tls certificate', async () => {
    mockReturnCode = 200;
    const transport = createTransport({
      caCerts: './some/path.pem',
      dsn,
    });
    await transport.sendEvent({
      message: 'test',
    });
    const requestOptions = (transport.module!.request as jest.Mock).mock.calls[0][0];
    assertBasicOptions(requestOptions);
    expect(requestOptions.ca).toEqual('mockedCert');
  });
});
