import { CellType } from "../enums/enums";
import { PathFinder } from "./pathFinder";
import { PriorityQueue } from "../datastructures/priorityQueue";
import { generateClassNameForCell } from "../utils/utils";

interface AStarCell {
  gCost: number;
  hCost: number;
  fCost: number;
  type: CellType;
  parent: AStarCell;
  row: number;
  col: number;
}

interface AStarHashmap {
  [identifier: string]: AStarCell;
}

export class AStar extends PathFinder {
  findShortestPath(): boolean {
    // create the astart cells
    let aStarHashmap: AStarHashmap = this._createAStarHashmap();
    let startCell = Object.values(aStarHashmap).filter(
      (c) => c.type === CellType.start
    )[0];
    let targetCell = Object.values(aStarHashmap).filter(
      (c) => c.type === CellType.target
    )[0];
    let result: AStarCell[] = [];
    let found = this.findShortestPathUtil(
      startCell,
      targetCell,
      aStarHashmap,
      result
    );
    let shortestPath = this.constructShortestPath(startCell, targetCell);
    this.visualisePath(result, shortestPath, found);
    return found;
  }

  visualisePath(
    result: AStarCell[],
    shortestPath: AStarCell[],
    found: boolean
  ) {
    result[0].type = CellType.start;
    shortestPath[0].type = CellType.target;
    this.animate(
      result.map((e) => {
        return { row: e.row, col: e.col, type: e.type, parent: e.parent };
      }),
      found,
      shortestPath
    );
    // this.constructShortestPath(aStarHashmap, startCell, targetCell);
  }
  constructShortestPath(startCell: AStarCell, targetCell: AStarCell) {
    let current = targetCell;
    let path: AStarCell[] = [];
    while (current !== startCell) {
      current.type = CellType.aStarShortestPath;
      path.push(Object.assign({}, current));
      current = current.parent;
    }
    return path;
  }

  // finding the shortest path between two nodes using the A* Algorithm
  findShortestPathUtil(
    startCell: AStarCell,
    targetCell: AStarCell,
    hashmap: AStarHashmap,
    result: AStarCell[]
  ) {
    let minHeap = this._initMinheap(Object.values(hashmap).length);
    let openCells = new Set<string>();
    let closedCells = new Set<string>();

    // init the start Cell
    startCell.hCost = this._getEstimatedDistanceBetweenTwoCells(
      startCell,
      targetCell
    );
    startCell.gCost = 0;
    startCell.fCost = this._calculateFCost(startCell.hCost, startCell.gCost);
    openCells.add(generateClassNameForCell(startCell.row, startCell.col));

    // add the start cell to the minheap
    minHeap.add(startCell);
    // while the heap is not empty keep calculating the path
    while (!minHeap.isEmpty()) {
      let minCell = minHeap.extractElementWithHeightPriority();
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
      for (let adjCell of this.getAdjacentAStarCells(minCell, hashmap)) {
        if (
          closedCells.has(generateClassNameForCell(adjCell.row, adjCell.col)) ||
          adjCell.type === CellType.visited
        ) {
          continue; // then we cannot process this node
        }
        // if the neighbour is not on the ope set or there is a shorter path to it then add it
        let newGCostToAdjCell =
          minCell.gCost +
          this._getEstimatedDistanceBetweenTwoCells(minCell, adjCell);
        if (
          !openCells.has(generateClassNameForCell(adjCell.row, adjCell.col)) ||
          newGCostToAdjCell < adjCell.gCost
        ) {
          let oldCopyOfAdjCell = Object.assign({}, adjCell);
          adjCell.gCost = newGCostToAdjCell;
          adjCell.hCost = this._getEstimatedDistanceBetweenTwoCells(
            adjCell,
            targetCell
          );
          adjCell.fCost = this._calculateFCost(adjCell.hCost, adjCell.fCost);
          adjCell.parent = minCell;
          adjCell.type = CellType.aStarVisiting;
          if (
            !openCells.has(generateClassNameForCell(adjCell.row, adjCell.col))
          ) {
            openCells.add(generateClassNameForCell(adjCell.row, adjCell.col));
            minHeap.add(adjCell);
          } else {
            minHeap.changePriority(oldCopyOfAdjCell, adjCell);
          }
        }
      }
    }
    return false;
  }
  getAdjacentAStarCells(cell: AStarCell, hashmap: AStarHashmap): AStarCell[] {
    let { row, col } = cell;
    let result = [];
    let rightCell = this.getAStarCell(row, col + 1, hashmap);
    let leftCell = this.getAStarCell(row, col - 1, hashmap);
    let upperCell = this.getAStarCell(row + 1, col, hashmap);
    let bottomCell = this.getAStarCell(row - 1, col, hashmap);
    if (rightCell) result.push(rightCell);
    if (leftCell) result.push(leftCell);
    if (upperCell) result.push(upperCell);
    if (bottomCell) result.push(bottomCell);
    return result;
  }

  getAStarCell(row: number, col: number, hashmap: AStarHashmap) {
    if (row >= 0 && row <= this.rows && col >= 0 && col <= this.cols) {
      return hashmap[generateClassNameForCell(row, col)];
    } else return null;
  }

  // getting the fCost that we sort based on
  _calculateFCost(hCost: number, gCost: number): number {
    return hCost + gCost;
  }
  _initMinheap(size: number): PriorityQueue<AStarCell> {
    let comparingFunction = (a: AStarCell, b: AStarCell) => {
      if (a.fCost < b.fCost) return 1;
      else if (a.fCost > b.fCost) return -1;
      else {
        if (a.hCost < b.hCost) return 1;
        else if (a.hCost > b.hCost) return -1;
        else return 1;
      }
    };

    let equalFunction = (a: AStarCell, b: AStarCell) =>
      a.row === b.row && a.col === b.col;
    let pq = new PriorityQueue<AStarCell>(
      size,
      comparingFunction,
      equalFunction
    );
    return pq;
  }

  // getting the distance between two cells with the heuristic. we can move diagonally with cost of 14 and left right up or down with cost of 10 like a triangle
  _getEstimatedDistanceBetweenTwoCells(
    firstCell: AStarCell,
    secondCell: AStarCell
  ): number {
    let distanceX = Math.abs(firstCell.row - secondCell.row);
    let distanceY = Math.abs(firstCell.col - secondCell.col);
    return (
      7 * Math.min(distanceX, distanceY) +
      10 *
        Math.abs(
          Math.max(distanceY, distanceX) - Math.min(distanceY, distanceX)
        )
    );
  }
  // creating the hashmap that we will work with
  _createAStarHashmap(): AStarHashmap {
    let cellHashmap = this.cellHashmap();
    let result: AStarHashmap = {};
    for (let entry of Object.entries(cellHashmap)) {
      let aStarCell: AStarCell = {
        gCost: Infinity,
        hCost: Infinity,
        fCost: Infinity,
        type: entry[1].state.type,
        row: entry[1].props.row,
        col: entry[1].props.col,
        parent: null,
      };
      result[entry[0]] = aStarCell;
    }
    return result;
  }
}
