import { EventEmitter } from "./eventEmitter";

describe("EventEmitter", () => {
  it("can be constructed", () => {
    const eventEmitter = new EventEmitter();
    expect(eventEmitter).toBeInstanceOf(EventEmitter);
  });

  it("can register a callback for a given event", () => {
    const eventEmitter = new EventEmitter();
    const callback = jest.fn();
    const payload = {};
    eventEmitter.register("mouseClick", callback);
    eventEmitter.emit("mouseClick", payload);
    expect(callback.mock.calls.length).toBe(1);
    const callbackParam1 = callback.mock.calls[0][0];
    expect(callbackParam1).toBe(payload);
  });

  it("can register different callbacks for a different events", () => {
    const eventEmitter = new EventEmitter();
    const mouseClickCallback = jest.fn();
    const keyPressCallback = jest.fn();
    const payload = {};
    eventEmitter.register("mouseClick", mouseClickCallback);
    eventEmitter.register("keyPressCallback", keyPressCallback);
    eventEmitter.emit("mouseClick", payload);
    expect(mouseClickCallback.mock.calls.length).toBe(1);
    const mouseClickCallbackParam1 = mouseClickCallback.mock.calls[0][0];
    expect(mouseClickCallbackParam1).toBe(payload);
    expect(keyPressCallback.mock.calls.length).toBe(0);
  });

  it("can register multiple callbacks for a given event", () => {
    const eventEmitter = new EventEmitter();
    const callbacks = [jest.fn(), jest.fn(), jest.fn()];
    const payload = {};
    callbacks.forEach((cb) => {
      eventEmitter.register("mouseClick", cb);
    });
    eventEmitter.emit("mouseClick", payload);
    callbacks.forEach((cb) => {
      expect(cb.mock.calls.length).toBe(1);
      const cbParam1 = cb.mock.calls[0][0];
      expect(cbParam1).toBe(payload);
    });
  });

  it("can unregister callbacks", () => {
    const eventEmitter = new EventEmitter();
    const callback = jest.fn();
    const payload = {};
    const eventId = eventEmitter.register("mouseClick", callback);

    eventEmitter.unregister(eventId);

    eventEmitter.emit("mouseClick", payload);
    expect(callback.mock.calls.length).toBe(0);
  })

  it("can register unique IDs per callback", () => {
    const eventEmitter = new EventEmitter();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const eventId1 = eventEmitter.register("mouseClick", callback1);
    const eventId2 = eventEmitter.register("mouseClick", callback2);

    expect(eventId1).not.toBe(eventId2)
  })

  it("throws an error if same callback is attempted to be registered twice", () => {
    const eventEmitter = new EventEmitter();
    const callback = jest.fn();
    eventEmitter.register("mouseClick", callback);
    expect(() => eventEmitter.register("mouseClick", callback)).toThrow();
  })
});
