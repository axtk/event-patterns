import {MatchParams, matchPattern} from './matchPattern.ts';

export type EventType = string | number | boolean | RegExp | null | undefined;
export type EventHandler = (event: Event) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Event<T = any> = {
    type: EventType;
    params?: MatchParams | null;
    data: T;
};

export type EventListener = {
    id: string;
    type: EventType | EventType[];
    handler: EventHandler;
    remove: () => void;
};

const getRandomString = () => Math.random().toString(36).slice(2);

export class EventManager {
    listeners: EventListener[];

    constructor() {
        this.listeners = [];
    }

    addListener(type: EventType | EventType[], handler: EventHandler): EventListener {
        if (typeof handler !== 'function')
            throw new Error('handler is not a function');

        let id = getRandomString();

        let remove = () => {
            for (let i = this.listeners.length - 1; i >= 0; i--) {
                if (this.listeners[i].id === id)
                    this.listeners.splice(i, 1);
            }
        };

        let listener = {id, type, handler, remove};

        this.listeners.push(listener);

        return listener;
    }

    dispatch(type: EventType, data?: unknown): void {
        let event: Event = {type, data};

        for (let listener of this.listeners) {
            if (this.shouldCallListener(listener, event))
                listener.handler(this.toHandlerPayload(listener, event));
        }
    }

    shouldCallListener(listener: EventListener, event: Event): boolean {
        return matchPattern(listener.type, event.type) !== null;
    }

    toHandlerPayload(listener: EventListener, event: Event): Event {
        let params = matchPattern(listener.type, event.type);

        return {...event, params};
    }
}
