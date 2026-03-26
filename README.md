# event-patterns

Lightweight zero-dependency event emitter with flexible event type matching

## Usage

Initialization:

```js
import { EventEmitter } from "event-patterns";

let eventEmitter = new EventEmitter();
```

Adding a handler of a specific event type:

```js
eventEmitter.on("task started", event => {
  console.log(event);
});
```

Of all events matching the pattern:

```js
eventEmitter.on(/^task\s/, event => {
  console.log(event);
});
```

With captured parameters:

```js
eventEmitter.on(/^(\S+)\s(?<status>.*)$/, event => {
  console.log(event.params[0], event.params.status);
});
```

Adding a handler of all events dispatched to the `eventEmitter` instance:

```js
let listener = eventEmitter.on("*", event => {
  console.log(event);
});
```

Dispatching an event of a specific type and properties:

```js
eventEmitter.emit("task started", { x: 42 });
```

Removing a previously declared listener:

```js
listener.remove();
```
