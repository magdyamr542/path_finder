export class PriorityQueue<T> {
  _size: number;
  _elements: T[] = [];
  length: number = 0;
  _comparingFunc: (a: T, b: T) => number;
  _equalFunction: (a: T, b: T) => boolean = (a: T, b: T) => a === b;

  constructor(
    maxSize: number,
    comparingFunc: (a: T, b: T) => number,
    equalFunc?: (a: T, b: T) => boolean
  ) {
    this._size = maxSize;
    this._comparingFunc = comparingFunc;
    this._equalFunction = equalFunc;
  }

  isEmpty() {
    return this.length === 0;
  }

  // getting the parent and childs
  parent(i: number) {
    return Math.floor((i - 1) / 2);
  }

  left(i: number) {
    return 2 * i + 1;
  }

  right(i: number) {
    return 2 * i + 2;
  }

  // heapify down
  private _heapify(index: number) {
    let leftIndex = this.left(index);
    let rightIndex = this.right(index);
    let indexToSwap = index;
    let leftElem = this._getElement(leftIndex);
    let rightElem = this._getElement(rightIndex);
    let currentElem = this._getElement(index);

    if (
      leftIndex < this.length &&
      this._comparingFunc(leftElem, currentElem) > 0
    ) {
      // it means that left has more priority
      indexToSwap = leftIndex;
      currentElem = leftElem;
    }

    if (
      rightIndex < this.length &&
      this._comparingFunc(rightElem, currentElem) > 0
    ) {
      // it means that right has more priority
      indexToSwap = rightIndex;
      currentElem = rightElem;
    }

    // if we need to swap then swap and call the method for the swapped index
    if (index !== indexToSwap) {
      this._swap(index, indexToSwap);
      this._heapify(indexToSwap);
    }
  }

  // get the element with height priority
  extractElementWithHighestPriority(): T {
    let result = this._getElement(0);
    let last = this._getElement(this.length - 1);
    this._elements[this.length - 1] = null;
    this.length--;
    this._elements[0] = last;
    this._heapify(0);
    return result;
  }

  // see the elem with heighest priority
  peek() {
    return this._elements[0];
  }

  // add element to the heap
  add(element: T) {
    if (this.length > this._size) {
      throw Error("the heap is full!!");
    }
    this._elements[this.length] = element;
    this._heapifyUp(this.length);
    this.length++;
  }

  // sift the element up till it reaches its place
  private _heapifyUp(index: number) {
    let elemToHeapifyUp = this._getElement(index);
    let current = index;
    let currentElem = elemToHeapifyUp;
    let currentParent = this._getElement(this.parent(current));
    while (
      this.parent(current) >= 0 &&
      this._comparingFunc(currentElem, currentParent) > 0
    ) {
      // it means that the parent has more priority
      this._swap(current, this.parent(current));
      current = this.parent(current);
      currentElem = this._getElement(current);
      currentParent = this._getElement(this.parent(current));
    }
    this._elements[current] = elemToHeapifyUp;
  }

  // change the priority of an element
  changePriority(element: T, newPriority: T) {
    let indexOfElement = this._elements.findIndex((elem, i) =>
      this._equalFunction(element, elem)
    );

    // if didnt find the element
    if (indexOfElement === -1) {
      throw Error(
        "There is no such element. how can you change its priority!!"
      );
    }
    this._elements[indexOfElement] = newPriority;
    // determine if we should go up or down
    let parentIndex = this.parent(indexOfElement);
    let parentElem = this._getElement(parentIndex);
    let currentNewElement = this._getElement(indexOfElement);

    if (
      parentIndex >= 0 &&
      this._comparingFunc(currentNewElement, parentElem) > 0
    ) {
      // the current new elem has a bigger prio so it should go up
      this._heapifyUp(indexOfElement);
    } else {
      this._heapify(indexOfElement);
    }
  }

  // HELPER FUNCTIONS
  private _swap(first: number, second: number) {
    let temp = this._elements[first];
    this._elements[first] = this._elements[second];
    this._elements[second] = temp;
  }

  // getting an element with its index
  _getElement(index: number) {
    return this._elements[index];
  }
}
