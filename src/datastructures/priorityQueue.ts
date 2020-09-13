export class PriorityQueue<T> {
  _size: number;
  _elements: T[] = [];
  length: number = 0;
  _comparingFunc: (a: T, b: T) => number;
  constructor(maxSize: number, comparingFunc: (a: T, b: T) => number) {
    this._size = maxSize;
    this._comparingFunc = comparingFunc;
  }

  isEmpty() {
    return this.length == 0;
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

    if (
      leftIndex < this.length &&
      this._comparingFunc(
        this._getElement[leftIndex],
        this._getElement[indexToSwap]
      ) > 0
    ) {
      // it means that left has more priority
      indexToSwap = leftIndex;
    }

    if (
      rightIndex < this.length &&
      this._comparingFunc(
        this._getElement[rightIndex],
        this._getElement[indexToSwap]
      ) > 0
    ) {
      // it means that right has more priority
      indexToSwap = rightIndex;
    }

    // if we need to swap then swap and call the method for the swapped index
    if (index != indexToSwap) {
      this._swap(index, indexToSwap);
      this._heapify(indexToSwap);
    }
  }

  // get the element with height priority
  extractElementWithHeightPriority(): T {
    let result = this._getElement(0);
    let last = this._getElement(this.length);
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
    this._heapifyUp(element);
  }

  // sift the element up till it reaches its place
  private _heapifyUp(element: T) {
    let current = this.length;
    while (
      this.parent(current) >= 0 &&
      this._comparingFunc(
        this._getElement(current),
        this._getElement(this.parent(current))
      ) > 0
    ) {
      // it means that the parent has more priority
      this._swap(current, this.parent(current));
      current = this.parent(current);
    }
    this._elements[current] = element;
  }

  // change the priority of an element
  changePriority(element: T, newPriority: T) {
    let indexOfElement = this._elements.findIndex(
      (elem, i) => elem === element
    );

    // if didnt find the element
    if (indexOfElement == -1) {
      throw Error(
        "There is no such element. how can you change its priority!!"
      );
    }
    this._elements[indexOfElement] = newPriority;
    let currentNewElement: T = this._getElement[indexOfElement];
    // determine if we should go up or down
    let parent = this.parent(indexOfElement);
    if (
      parent >= 0 &&
      this._comparingFunc(currentNewElement, this._getElement(parent)) > 0
    ) {
      // the current new elem has a bigger prio so it should go up
      this._heapifyUp(currentNewElement);
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
  private _getElement(index: number) {
    if (index >= this._size) {
      throw Error("index out of bounds!!");
    }
    return this._elements[index];
  }
}
