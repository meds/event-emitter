import { nanoid } from 'nanoid'

export type Handler = (payload: unknown) => void;

interface IMouseClickEvent {

}
interface IKeyPressCallback {

}
interface IEventMap {
  'mouseClick': IMouseClickEvent,
  'keyPressCallback': IKeyPressCallback
}

export interface IEventHandler<T extends keyof IEventMap> {
  id: string;
  handler: ((ev: IEventMap[T]) => void);
}

export class EventEmitter {
  private eventHandlers: Record<keyof IEventMap, IEventHandler<keyof IEventMap>[]> = {
    'keyPressCallback': [],
    'mouseClick': []
  }

  constructor() { }
  register<K extends keyof IEventMap>(eventType: K, handler: (ev: IEventMap[K]) => void) {
    if(this.eventHandlers[eventType]?.find(eventHandler => eventHandler.handler === handler) !== undefined) {
      throw new Error("Handler already registered.");
    }
    this.eventHandlers[eventType] = this.eventHandlers[eventType] ?? [];

    const eventHandler = {
      handler: handler,
      id: nanoid()
    };

    this.eventHandlers[eventType].push(eventHandler)

    return eventHandler.id;
  }
  unregister(id: string) {
    Object.keys(this.eventHandlers).forEach(key => {
      const eventHandlers = this.eventHandlers[key as keyof IEventMap];
      this.eventHandlers[key as keyof IEventMap] = eventHandlers.filter(handler => handler.id !== id)
    });
  }
  emit<T extends keyof IEventMap>(eventType: T, payload: IEventMap[T]) {
    this.eventHandlers[eventType].forEach(eventHandler => eventHandler.handler(payload))
  }
}