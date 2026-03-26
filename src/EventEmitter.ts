import { type MatchParams, matchPattern } from "./matchPattern.ts";

export type EventType = string | number | boolean | RegExp | null | undefined;
export type EventHandler = (event: Event) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: most generic default
export type Event<T = any> = {
  type: EventType;
  params?: MatchParams | null;
  data: T;
};

export type EventListener = {
  remove: () => void;
};

export type EventListenerMetadata = {
  id: string;
  type: EventType;
  handler: EventHandler;
  once: boolean;
};

function getId() {
  return Math.random().toString(36).slice(2);
}

export class EventEmitter {
  _listeners: EventListenerMetadata[];

  constructor() {
    this._listeners = [];
  }

  on(type: EventType, handler: EventHandler) {
    return this._addListener(type, handler);
  }

  once(type: EventType, handler: EventHandler) {
    return this._addListener(type, handler, true);
  }

  addListener(type: EventType, handler: EventHandler) {
    return this._addListener(type, handler);
  }

  _addListener(
    type: EventType,
    handler: EventHandler,
    once = false,
  ): EventListener {
    if (typeof handler !== "function")
      throw new Error("handler is not a function");

    let id = getId();

    this._listeners.push({ id, type, handler, once });

    return {
      remove: () => this._removeListener(id),
    };
  }

  _removeListener(id: string) {
    for (let i = this._listeners.length - 1; i >= 0; i--) {
      if (this._listeners[i].id === id) this._listeners.splice(i, 1);
    }
  }

  emit(type: EventType, data?: unknown): void {
    let event: Event = { type, data };

    for (let listener of this._listeners) {
      if (this.matches(listener, event)) {
        if (listener.once) this._removeListener(listener.id);

        listener.handler(this.toHandlerPayload(listener, event));
      }
    }
  }

  matches(listener: EventListenerMetadata, event: Partial<Event>): boolean {
    return matchPattern(listener.type, event.type) !== null;
  }

  toHandlerPayload(listener: EventListenerMetadata, event: Event): Event {
    let params = matchPattern(listener.type, event.type);

    return { ...event, params };
  }
}
