# event-patterns

A lightweight zero-dependency event manager with flexible event type matching

## Usage

Initialization:

```js
import {EventManager} from 'event-patterns';

let eventManager = new EventManager();
```

Adding a handler of a specific event type:

```js
eventManager.addListener('task started', event => {
    console.log(event);
});
```

Of all events matching the pattern:

```js
eventManager.addListener(/^task\s/, event => {
    console.log(event);
});
```

With captured parameters:

```js
eventManager.addListener(/^(\S+)\s(?<status>.*)$/, event => {
    console.log(event.params[0], event.params.status);
});
```

Adding a handler of all events dispatched to the `eventManager` instance:

```js
let listener = eventManager.addListener('*', event => {
    console.log(event);
});
```

Dispatching an event of a specific type and properties:

```js
eventManager.dispatch('task started', {x: 42});
```

Removing a previously declared listener:

```js
listener.remove();
```
