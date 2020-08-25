export class Payload<T> {
  data: T;
  next: Payload<T>;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class Queue<T> {
  private head: Payload<T>;
  private tail: Payload<T>;
  private length: number;

  constructor() {
    this.head = new Payload(null);
    this.tail = new Payload(null);
    this.length = 0;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  enqueue(data: T) {
    let elem = new Payload(data);
    if (this.isEmpty()) {
      this.head = this.tail = elem;
      this.length++;
    } else {
      this.tail.next = elem;
      this.tail = elem;
      this.length++;
    }
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("The Queue is Empty");
    }
    let result = this.head.data;
    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = this.tail = new Payload(null);
    }
    this.length--;
    return result;
  }
}
