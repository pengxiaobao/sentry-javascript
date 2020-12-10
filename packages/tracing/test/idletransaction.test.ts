import { BrowserClient } from '@sentry-csii/browser';
import { Hub } from '@sentry-csii/hub';

import { DEFAULT_IDLE_TIMEOUT, IdleTransaction, IdleTransactionSpanRecorder } from '../src/idletransaction';
import { Span } from '../src/span';
import { SpanStatus } from '../src/spanstatus';

let hub: Hub;
beforeEach(() => {
  hub = new Hub(new BrowserClient({ tracesSampleRate: 1 }));
});

describe('IdleTransaction', () => {
  describe('onScope', () => {
    it('sets the transaction on the scope on creation if onScope is true', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000, true);
      transaction.initSpanRecorder(10);

      hub.configureScope(s => {
        expect(s.getTransaction()).toBe(transaction);
      });
    });

    it('does not set the transaction on the scope on creation if onScope is falsey', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
      transaction.initSpanRecorder(10);

      hub.configureScope(s => {
        expect(s.getTransaction()).toBe(undefined);
      });
    });

    it('removes transaction from scope on finish if onScope is true', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000, true);
      transaction.initSpanRecorder(10);

      transaction.finish();
      jest.runAllTimers();

      hub.configureScope(s => {
        expect(s.getTransaction()).toBe(undefined);
      });
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('push and pops activities', () => {
    const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
    const mockFinish = jest.spyOn(transaction, 'finish');
    transaction.initSpanRecorder(10);
    expect(transaction.activities).toMatchObject({});

    const span = transaction.startChild();
    expect(transaction.activities).toMatchObject({ [span.spanId]: true });

    expect(mockFinish).toHaveBeenCalledTimes(0);

    span.finish();
    expect(transaction.activities).toMatchObject({});

    jest.runOnlyPendingTimers();
    expect(mockFinish).toHaveBeenCalledTimes(1);
  });

  it('does not push activities if a span already has an end timestamp', () => {
    const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
    transaction.initSpanRecorder(10);
    expect(transaction.activities).toMatchObject({});

    transaction.startChild({ startTimestamp: 1234, endTimestamp: 5678 });
    expect(transaction.activities).toMatchObject({});
  });

  it('does not finish if there are still active activities', () => {
    const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
    const mockFinish = jest.spyOn(transaction, 'finish');
    transaction.initSpanRecorder(10);
    expect(transaction.activities).toMatchObject({});

    const span = transaction.startChild();
    const childSpan = span.startChild();

    expect(transaction.activities).toMatchObject({ [span.spanId]: true, [childSpan.spanId]: true });
    span.finish();
    jest.runOnlyPendingTimers();

    expect(mockFinish).toHaveBeenCalledTimes(0);
    expect(transaction.activities).toMatchObject({ [childSpan.spanId]: true });
  });

  it('calls beforeFinish callback before finishing', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
    transaction.initSpanRecorder(10);
    transaction.registerBeforeFinishCallback(mockCallback1);
    transaction.registerBeforeFinishCallback(mockCallback2);

    expect(mockCallback1).toHaveBeenCalledTimes(0);
    expect(mockCallback2).toHaveBeenCalledTimes(0);

    const span = transaction.startChild();
    span.finish();

    jest.runOnlyPendingTimers();
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback1).toHaveBeenLastCalledWith(transaction, expect.any(Number));
    expect(mockCallback2).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenLastCalledWith(transaction, expect.any(Number));
  });

  it('filters spans on finish', () => {
    const transaction = new IdleTransaction({ name: 'foo', startTimestamp: 1234 }, hub, 1000);
    transaction.initSpanRecorder(10);

    // regular child - should be kept
    const regularSpan = transaction.startChild({ startTimestamp: transaction.startTimestamp + 2 });

    // discardedSpan - startTimestamp is too large
    transaction.startChild({ startTimestamp: 645345234 });

    // Should be cancelled - will not finish
    const cancelledSpan = transaction.startChild({ startTimestamp: transaction.startTimestamp + 4 });

    regularSpan.finish(regularSpan.startTimestamp + 4);
    transaction.finish(transaction.startTimestamp + 10);

    expect(transaction.spanRecorder).toBeDefined();
    if (transaction.spanRecorder) {
      const spans = transaction.spanRecorder.spans;
      expect(spans).toHaveLength(3);
      expect(spans[0].spanId).toBe(transaction.spanId);

      // Regular Span - should not modified
      expect(spans[1].spanId).toBe(regularSpan.spanId);
      expect(spans[1].endTimestamp).not.toBe(transaction.endTimestamp);

      // Cancelled Span - has endtimestamp of transaction
      expect(spans[2].spanId).toBe(cancelledSpan.spanId);
      expect(spans[2].status).toBe(SpanStatus.Cancelled);
      expect(spans[2].endTimestamp).toBe(transaction.endTimestamp);
    }
  });

  describe('_initTimeout', () => {
    it('finishes if no activities are added to the transaction', () => {
      const transaction = new IdleTransaction({ name: 'foo', startTimestamp: 1234 }, hub, 1000);
      transaction.initSpanRecorder(10);

      jest.runTimersToTime(DEFAULT_IDLE_TIMEOUT);
      expect(transaction.endTimestamp).toBeDefined();
    });

    it('does not finish if a activity is started', () => {
      const transaction = new IdleTransaction({ name: 'foo', startTimestamp: 1234 }, hub, 1000);
      transaction.initSpanRecorder(10);
      transaction.startChild({});

      jest.runTimersToTime(DEFAULT_IDLE_TIMEOUT);
      expect(transaction.endTimestamp).toBeUndefined();
    });
  });

  describe('heartbeat', () => {
    it('does not start heartbeat if there is no span recorder', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
      const mockFinish = jest.spyOn(transaction, 'finish');

      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 2
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 3
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);
    });

    it('finishes a transaction after 3 beats', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
      const mockFinish = jest.spyOn(transaction, 'finish');
      transaction.initSpanRecorder(10);

      expect(mockFinish).toHaveBeenCalledTimes(0);
      transaction.startChild({});

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 2
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 3
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(1);
    });

    it('resets after new activities are added', () => {
      const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
      const mockFinish = jest.spyOn(transaction, 'finish');
      transaction.initSpanRecorder(10);

      expect(mockFinish).toHaveBeenCalledTimes(0);
      transaction.startChild({});

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      const span = transaction.startChild(); // push activity

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 2
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      transaction.startChild(); // push activity
      transaction.startChild(); // push activity

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 2
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      span.finish(); // pop activity

      // Beat 1
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 2
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(0);

      // Beat 3
      jest.runOnlyPendingTimers();
      expect(mockFinish).toHaveBeenCalledTimes(1);

      // Heartbeat does not keep going after finish has been called
      jest.runAllTimers();
      expect(mockFinish).toHaveBeenCalledTimes(1);
    });
  });
});

describe('IdleTransactionSpanRecorder', () => {
  it('pushes and pops activities', () => {
    const mockPushActivity = jest.fn();
    const mockPopActivity = jest.fn();
    const spanRecorder = new IdleTransactionSpanRecorder(mockPushActivity, mockPopActivity, undefined, 10);
    expect(mockPushActivity).toHaveBeenCalledTimes(0);
    expect(mockPopActivity).toHaveBeenCalledTimes(0);

    const span = new Span({ sampled: true });

    expect(spanRecorder.spans).toHaveLength(0);
    spanRecorder.add(span);
    expect(spanRecorder.spans).toHaveLength(1);

    expect(mockPushActivity).toHaveBeenCalledTimes(1);
    expect(mockPushActivity).toHaveBeenLastCalledWith(span.spanId);
    expect(mockPopActivity).toHaveBeenCalledTimes(0);

    span.finish();
    expect(mockPushActivity).toHaveBeenCalledTimes(1);
    expect(mockPopActivity).toHaveBeenCalledTimes(1);
    expect(mockPushActivity).toHaveBeenLastCalledWith(span.spanId);
  });

  it('does not push activities if a span has a timestamp', () => {
    const mockPushActivity = jest.fn();
    const mockPopActivity = jest.fn();
    const spanRecorder = new IdleTransactionSpanRecorder(mockPushActivity, mockPopActivity, undefined, 10);

    const span = new Span({ sampled: true, startTimestamp: 765, endTimestamp: 345 });
    spanRecorder.add(span);

    expect(mockPushActivity).toHaveBeenCalledTimes(0);
  });

  it('does not push or pop transaction spans', () => {
    const mockPushActivity = jest.fn();
    const mockPopActivity = jest.fn();

    const transaction = new IdleTransaction({ name: 'foo' }, hub, 1000);
    const spanRecorder = new IdleTransactionSpanRecorder(mockPushActivity, mockPopActivity, transaction.spanId, 10);

    spanRecorder.add(transaction);
    expect(mockPushActivity).toHaveBeenCalledTimes(0);
    expect(mockPopActivity).toHaveBeenCalledTimes(0);
  });
});
