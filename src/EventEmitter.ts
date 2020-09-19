// you can dispatch events (subscribe to them) and listen for events when they get emitted

type Eventhandler<T> = (eventPayload: T) => void;

interface Unsubscriber {
  unsubscribe: () => void;
}

interface EventEmitterInterface<T> {
  on: (eventName: string, eventHandler: Eventhandler<T>) => Unsubscriber; // this is like the listener button.on()
  emit: (eventName: string, eventPayload: T) => void; // this is what fires the event
}

export class EventEmitter<T> implements EventEmitterInterface<T> {
  private _listeners: { [eventName: string]: Eventhandler<T>[] }; // a hash map which maps the name of the event to its callback funciton
  constructor() {
    this._listeners = {};
  }
  on(eventName: string, eventHandler: Eventhandler<T>): Unsubscriber {
    if (typeof eventHandler !== "function") {
      throw Error("Your Event Handler should be a FUNCTION");
    }
    // when dispatching an event we want to save the name with its handler
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [eventHandler];
    } else {
      this._listeners[eventName].push(eventHandler);
    }
    return {
      unsubscribe: () => {
        // search for the event handler and remove it from the listeners array
        let handlerIndex = this._listeners[eventName].indexOf(eventHandler);
        this._listeners[eventName].splice(handlerIndex, 1);
      },
    };
  }

  // emitting the event is firing it
  emit(eventName: string, eventPayload: T): void {
    if (!this._listeners[eventName]) {
      throw Error("There is no such event with this name");
    } else {
      this._listeners[eventName].forEach((handler) => handler(eventPayload));
    }
  }
}
