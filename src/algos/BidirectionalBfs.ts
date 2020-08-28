import { CellType } from "../enums/enums";
import { PathFinder, PathFinderCell, PathFinderResult } from "./pathFinder";
import { Queue } from "../datastructures/queue";
import { generateClassNameForCell } from "../utils/utils";

export interface BFSResult extends PathFinderResult {}
export interface BFSCell extends PathFinderCell {}
export interface BFSCellHashmap {
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
    this._animate(resultStart, resultTarget, cells, cellFound);
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
      if (currentCell.type === CellType.visited) return false;
      if (currentCell.type === CellType.unvisited) {
        currentCell.type = CellType.bfsPath;
        result.push(currentCell);
      }

      for (let adjCell of this.getAdjacentCells(currentCell, cells)) {
        // if we visited that cell from other side then there is a path
        if (this.cellhashmapContains(visitedFromThatSide, adjCell)) {
          adjCell.type = CellType.bfsConnect;
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

  _animate = (
    resultStart: PathFinderResult[],
    resultTarget: PathFinderResult[],
    cells: PathFinderCell[][],
    targetFound: boolean
  ) => {
    // get the connecting point
    let connect = resultStart.filter((c) => c.type === CellType.bfsConnect);
    if (connect.length === 0) {
      connect = resultTarget.filter((c) => c.type === CellType.bfsConnect);
    }
    let isStartFirstToAnimate = resultStart.length < resultTarget.length;

    // animate the result
    this.animateResult(
      isStartFirstToAnimate ? resultStart : resultTarget,
      this.cellHashmap(),
      this.animateResultSpeed()
    );
    this.animateResult(
      isStartFirstToAnimate ? resultTarget : resultStart,
      this.cellHashmap(),
      this.animateResultSpeed()
    ).then((res) => {
      if (!targetFound) return;
      let pathFromConnectToStart = this._getPathFromConnectToStart(
        connect,
        cells,
        resultStart
      );
      let pathFromConnectToTarget = this._getPathFromConnectToTarget(
        connect,
        cells,
        resultTarget
      );
      this.animateResult(
        pathFromConnectToStart,
        this.cellHashmap(),
        this.animateResultSpeed()
      );
      this.animateResult(
        pathFromConnectToTarget,
        this.cellHashmap(),
        this.animateResultSpeed()
      );
    });
  };

  _getPathFromConnectToStart(
    connect: PathFinderResult[],
    cells: PathFinderCell[][],
    resultStart: PathFinderResult[]
  ) {
    // get all ajacent cells of the connect cell which are in the targetStart array
    let connectAdjCells = this.getAdjacentCells(connect[0], cells);
    let cellInStartWhichIsAdjToConnectCell: PathFinderCell;
    connectAdjCells.forEach((adjCell) => {
      if (
        resultStart.find((c) => c.row === adjCell.row && c.col === adjCell.col)
      )
        cellInStartWhichIsAdjToConnectCell = adjCell;
    });
    let startConnect: PathFinderResult = Object.assign({}, connect[0]);
    startConnect.parent = {
      row: cellInStartWhichIsAdjToConnectCell.row,
      col: cellInStartWhichIsAdjToConnectCell.col,
    };
    resultStart.push(startConnect);
    return this.constructActualPath(resultStart, CellType.bfsConnect);
  }

  _getPathFromConnectToTarget(
    connect: PathFinderResult[],
    cells: PathFinderCell[][],
    resultTarget: PathFinderResult[]
  ) {
    // get all ajacent cells of the connect cell which are in the targetStart array
    let connectAdjCells = this.getAdjacentCells(connect[0], cells);
    let cellInEndWhichIsAdjToConnectCell: PathFinderCell;
    connectAdjCells.forEach((adjCell) => {
      if (
        resultTarget.find((c) => c.row === adjCell.row && c.col === adjCell.col)
      )
        cellInEndWhichIsAdjToConnectCell = adjCell;
    });
    let startConnect: PathFinderResult = Object.assign({}, connect[0]);
    startConnect.parent = {
      row: cellInEndWhichIsAdjToConnectCell.row,
      col: cellInEndWhichIsAdjToConnectCell.col,
    };
    resultTarget.push(startConnect);
    return this.constructActualPath(resultTarget, CellType.bfsConnect);
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
