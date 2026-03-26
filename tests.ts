import {Event, EventManager} from './src/EventManager.ts';
import {MatchParams} from './src/matchPattern.ts';

let eventManager = new EventManager(), listener;
let x = 0;

console.log('exact event type');

listener = eventManager.addListener('update', (event: Event<{dx: number}>) => {
    console.assert(event.type === 'update', 'event type should match listener type');
    x += event.data.dx;
});
console.assert(eventManager.listeners.length === 1, 'added listener');
console.assert(x === 0, 'initial state');

eventManager.dispatch('update', {dx: 1});
console.assert(x === 1, '+1');

eventManager.dispatch('update', {dx: 2});
console.assert(x === 3, '+2');

eventManager.dispatch('update', {dx: -3});
console.assert(x === 0, '-3');

listener.remove();
console.assert(eventManager.listeners.length === 0, 'removed listener');

eventManager.dispatch('update', {dx: 5});
console.assert(x === 0, 'no updates, listener is removed');

console.log('event type pattern');
x = 0;

listener = eventManager.addListener(/^task\s/, (event: Event<{dx: number}>) => {
    x += event.data.dx;
});
console.assert(x === 0, 'initial state');

eventManager.dispatch('task started', {dx: 42});
console.assert(x === 42, 'matching event');

eventManager.dispatch('subtask started', {dx: -42});
console.assert(x === 42, 'non-matching event');

listener.remove();

console.log('event type pattern params');
let p: MatchParams | null | undefined;

listener = eventManager.addListener(/^(\S+)\s+(?<status>.+)$/, event => {
    p = event.params;
});
console.assert(p === undefined, 'initial state');

eventManager.dispatch('task started', {dx: 42});
console.assert(p?.[0] === 'task' && p?.status === 'started', 'task started');

eventManager.dispatch('subtask completed', {dx: -42});
console.assert(p?.[0] === 'subtask' && p?.status === 'completed', 'subtask completed');

listener.remove();
