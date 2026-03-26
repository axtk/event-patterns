import {
  type Event,
  EventEmitter,
  type EventListener,
  type MatchParams,
} from "./index.ts";

let eventEmitter = new EventEmitter();
let x = 0;
let listener: EventListener;

console.log("exact event type");

listener = eventEmitter.addListener(
  "update",
  (event: Event<{ dx: number }>) => {
    console.assert(
      event.type === "update",
      "event type should match listener type",
    );
    x += event.data.dx;
  },
);
console.assert(eventEmitter._listeners.length === 1, "added listener");
console.assert(x === 0, "initial state");

eventEmitter.emit("update", { dx: 1 });
console.assert(x === 1, "+1");

eventEmitter.emit("update", { dx: 2 });
console.assert(x === 3, "+2");

eventEmitter.emit("update", { dx: -3 });
console.assert(x === 0, "-3");

listener.remove();
console.assert(eventEmitter._listeners.length === 0, "removed listener");

eventEmitter.emit("update", { dx: 5 });
console.assert(x === 0, "no updates, listener is removed");

console.log("event type pattern");
x = 0;

listener = eventEmitter.addListener(
  /^task\s/,
  (event: Event<{ dx: number }>) => {
    x += event.data.dx;
  },
);
console.assert(x === 0, "initial state");

eventEmitter.emit("task started", { dx: 42 });
console.assert(x === 42, "matching event");

eventEmitter.emit("subtask started", { dx: -42 });
console.assert(x === 42, "non-matching event");

listener.remove();

console.log("event type pattern params");
let p: MatchParams | null | undefined;

listener = eventEmitter.addListener(/^(\S+)\s+(?<status>.+)$/, (event) => {
  p = event.params;
});
console.assert(p === undefined, "initial state");

eventEmitter.emit("task started", { dx: 42 });
console.assert(p?.[0] === "task" && p?.status === "started", "task started");

eventEmitter.emit("subtask completed", { dx: -42 });
console.assert(
  p?.[0] === "subtask" && p?.status === "completed",
  "subtask completed",
);

listener.remove();
