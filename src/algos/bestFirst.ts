import { CellType } from "../enums/enums";
import { PathFinder } from "./pathFinder";
import { PriorityQueue } from "../datastructures/priorityQueue";
import { generateClassNameForCell } from "../utils/utils";

interface BestFirstCell {
  hCost: number;
  type: CellType;
  parent: BestFirstCell;
  row: number;
  col: number;
}

interface BestFirstHashmap {
  [identifier: string]: BestFirstCell;
}

export class BestFirst extends PathFinder {
  findShortestPath(): boolean {
    // create the astart cells
    let bestFirstHashmap: BestFirstHashmap = this._createBestFirstHashmap();
    let startCell = Object.values(bestFirstHashmap).filter(
      (c) => c.type === CellType.start
    )[0];
    let targetCell = Object.values(bestFirstHashmap).filter(
      (c) => c.type === CellType.target
    )[0];
    // calculate the hCosts for all cells
    this._calculateHCostForAllCells(bestFirstHashmap, targetCell);
    let result: BestFirstCell[] = [];
    let found = this.bestFirstSearch(
      startCell,
      targetCell,
      bestFirstHashmap,
      result
    );
    this.visualisePath(result, found);
    return found;
  }
  private _calculateHCostForAllCells(
    bestFirstHashmap: BestFirstHashmap,
    targetCell: BestFirstCell
  ) {
    Object.values(bestFirstHashmap).forEach((v) => {
      v.hCost = this._getEstimatedDistanceBetweenTwoCells(v, targetCell);
    });
  }

  visualisePath(result: BestFirstCell[], found: boolean) {
    result[0].type = CellType.start;
    if (found) result[result.length - 1].type = CellType.target;
    this.animate(
      result.map((e) => {
        return { row: e.row, col: e.col, type: e.type, parent: e.parent };
      }),
      found
    );
    // this.constructShortestPath(aStarHashmap, startCell, targetCell);
  }

  // finding the shortest path between two nodes using the A* Algorithm
  bestFirstSearch(
    startCell: BestFirstCell,
    targetCell: BestFirstCell,
    hashmap: BestFirstHashmap,
    result: BestFirstCell[]
  ) {
    let minHeap = this._initMinheap(Object.values(hashmap).length);
    let openCells = new Set<string>();
    let closedCells = new Set<string>();

    openCells.add(generateClassNameForCell(startCell.row, startCell.col));

    // add the start cell to the minheap
    minHeap.add(startCell);
    // while the heap is not empty keep calculating the path
    while (!minHeap.isEmpty()) {
      let minCell = minHeap.extractElementWithHighestPriority();
      minCell.type = CellType.aStarVisited;
      result.push(minCell);
      // remove the minCell from the open cells and add it to the closed ones
      openCells.delete(generateClassNameForCell(minCell.row, minCell.col));
      closedCells.add(generateClassNameForCell(minCell.row, minCell.col));
      // if this cell is the path then return true
      if (
        this.isEqual(
          { row: minCell.row, col: minCell.col },
          { row: targetCell.row, col: targetCell.col }
        )
      ) {
        minCell.type = CellType.target;
        result.push(minCell);
        return true;
      }

      // if not then process all its adj cells
      for (let adjCell of this.getAdjacentBestFirstCells(minCell, hashmap)) {
        if (
          closedCells.has(generateClassNameForCell(adjCell.row, adjCell.col)) ||
          adjCell.type === CellType.visited
        ) {
          continue; // then we cannot process this node
        }
        if (
          !openCells.has(generateClassNameForCell(adjCell.row, adjCell.col))
        ) {
          adjCell.parent = minCell;
          adjCell.type = CellType.aStarVisiting;
          result.push(adjCell);
          if (
            !openCells.has(generateClassNameForCell(adjCell.row, adjCell.col))
          ) {
            openCells.add(generateClassNameForCell(adjCell.row, adjCell.col));
            minHeap.add(adjCell);
          }
        }
      }
    }
    return false;
  }
  getAdjacentBestFirstCells(
    cell: BestFirstCell,
    hashmap: BestFirstHashmap
  ): BestFirstCell[] {
    let { row, col } = cell;
    let result = [];
    // use this code to get 8 adj cells. it means you can go in any direction even the diagonals
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) continue;
        let cell = this.getBestFirstCell(row + i, col + j, hashmap);
        if (cell) result.push(cell);
      }
    }

    return result;
  }

  getBestFirstCell(row: number, col: number, hashmap: BestFirstHashmap) {
    if (row >= 0 && row <= this.rows && col >= 0 && col <= this.cols) {
      return hashmap[generateClassNameForCell(row, col)];
    } else return null;
  }

  // getting the fCost that we sort based on
  _calculateFCost(hCost: number, gCost: number): number {
    return hCost + gCost;
  }
  _initMinheap(size: number): PriorityQueue<BestFirstCell> {
    let comparingFunction = (a: BestFirstCell, b: BestFirstCell) => {
      if (a.hCost < b.hCost) return 1;
      else if (a.hCost > b.hCost) return -1;
      else return 0;
    };

    let equalFunction = (a: BestFirstCell, b: BestFirstCell) =>
      a.row === b.row && a.col === b.col;
    let pq = new PriorityQueue<BestFirstCell>(
      size,
      comparingFunction,
      equalFunction
    );
    return pq;
  }

  // getting the distance between two cells with the heuristic. we can move diagonally with cost of 14 and left right up or down with cost of 10 like a triangle
  _getEstimatedDistanceBetweenTwoCells(
    firstCell: BestFirstCell,
    secondCell: BestFirstCell
  ): number {
    let distanceX = firstCell.row - secondCell.row;
    let distanceY = firstCell.col - secondCell.col;
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
  }
  // creating the hashmap that we will work with
  _createBestFirstHashmap(): BestFirstHashmap {
    let cellHashmap = this.cellHashmap();
    let result: BestFirstHashmap = {};
    for (let entry of Object.entries(cellHashmap)) {
      let bestFirstCell: BestFirstCell = {
        hCost: Infinity,
        type: entry[1].state.type,
        row: entry[1].props.row,
        col: entry[1].props.col,
        parent: null,
      };
      result[entry[0]] = bestFirstCell;
    }
    return result;
  }
}
