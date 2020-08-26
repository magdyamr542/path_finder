import { CellType } from "../enums/enums";
import { PathFinder, PathFinderCell, PathFinderResult } from "./pathFinder";
import { Queue } from "../datastructures/queue";
import { generateClassNameForCell } from "../utils/utils";

interface BFSResult extends PathFinderResult {}
interface BFSCell extends PathFinderCell {}
interface BFSCellHashmap {
  [key: string]: BFSCell;
}
export class BidirectionalBFS extends PathFinder {
  bfs = () => {
    let cells = this.generateCellsFromHashMap();
    let start = this.filterForCell(CellType.start);
    let target = this.filterForCell(CellType.target);
    let resultStart: BFSResult[] = [];
    let resultTarget: BFSResult[] = [];

    let cellFound: boolean = this.bfsUtil(
      start,
      target,
      cells,
      resultStart,
      resultTarget
    );

    // if (cellFound) {
    //   this.animate(resultStart, true);
    //   return true;
    // } else {
    //   this.animate(resultStart, false);
    //   return false;
    // }
    console.log(resultStart, resultTarget, this, "Cell Found", cellFound);
    return cellFound;
  };

  bfsUtil = (
    start: BFSCell,
    target: BFSCell,
    cells: BFSCell[][],
    resultStart: BFSResult[],
    resultTarget: BFSResult[] // empty array at the beginning
  ): boolean => {
    // we will have two arrays
    let startQueue = new Queue<BFSCell>();
    let targetQueue = new Queue<BFSCell>();
    let startCellhashmap: BFSCellHashmap = {};
    let targetCellhashmap: BFSCellHashmap = {};
    start.type = CellType.start;
    target.type = CellType.target;

    // add start and target to  queues
    startQueue.enqueue(start);
    targetQueue.enqueue(target);
    resultStart.push(start);
    resultTarget.push(target);

    this.addToCellhashmap(startCellhashmap, start);
    this.addToCellhashmap(targetCellhashmap, target);

    while (!startQueue.isEmpty() || !targetQueue.isEmpty()) {
      if (
        this.pathExistsHelper(
          startQueue,
          startCellhashmap,
          targetCellhashmap,
          cells,
          resultStart
        )
      ) {
        return true;
        // when you see a cell add it to the cells hash map
      }
      if (
        this.pathExistsHelper(
          targetQueue,
          targetCellhashmap,
          startCellhashmap,
          cells,
          resultTarget
        )
      ) {
        return true;
      }
    }
    // return false if nothing found
    return false;
  };

  pathExistsHelper(
    currentQueue: Queue<BFSCell>,
    visitedFromThisSide: BFSCellHashmap,
    visitedFromThatSide: BFSCellHashmap,
    cells: BFSCell[][],
    result: BFSResult[]
  ) {
    if (!currentQueue.isEmpty()) {
      let currentCell = currentQueue.dequeue();
      if (currentCell.type == CellType.visited) return false;
      if (currentCell.type == CellType.unvisited) {
        currentCell.type = CellType.bfsPath;
        result.push(currentCell);
      }

      for (let adjCell of this.getAdjacentCells(currentCell, cells)) {
        // if we visited that cell from other side then there is a path
        if (this.cellhashmapContains(visitedFromThatSide, adjCell)) {
          console.log("connecting point", adjCell);
          adjCell.type = CellType.bfsPath;
          result.push(adjCell);
          return true;
        } else {
          // then visit the current node
          if (
            adjCell.type !== CellType.bfsPath &&
            adjCell.type !== CellType.visited
          ) {
            adjCell.parent = { row: currentCell.row, col: currentCell.col };
            currentQueue.enqueue(adjCell);
            this.addToCellhashmap(visitedFromThisSide, adjCell);
          }
        }
      }
    }
    return false;
  }

  addToCellhashmap(map: BFSCellHashmap, cell: BFSCell) {
    let key = generateClassNameForCell(cell.row, cell.col);
    map[key] = cell;
  }

  cellhashmapContains(map: BFSCellHashmap, cell: BFSCell) {
    let found = map[generateClassNameForCell(cell.row, cell.col)];
    return found !== undefined;
  }
}
