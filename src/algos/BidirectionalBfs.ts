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

    this._animate(resultStart, resultTarget, cellFound, cells);

    return cellFound;
  };

  _animate = (
    resultStart: PathFinderResult[],
    resultTarget: PathFinderResult[],
    targetFound: boolean,
    cells: PathFinderCell[][]
  ) => {
    // get the connecting point
    let connectInStart = true;
    let connect = resultStart.filter((c) => c.type === CellType.bfsConnect);
    if (connect.length === 0) {
      connectInStart = false;
      connect = resultTarget.filter((c) => c.type === CellType.bfsConnect);
    }
    // call the animator for both parts
    this._animateResult(resultStart, targetFound);
    this._animateResult(resultTarget, targetFound);
    this._animatePathFromConnectToStart(connect, cells, resultStart);
    this._animatePathFromConnectToEnd(connect, cells, resultTarget);
  };

  _animatePathFromConnectToStart(
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
    console.log(this, resultStart);
  }

  _animatePathFromConnectToEnd(
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
    console.log(this, resultTarget);
  }

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

  _animatePathFromStart = (path: PathFinderResult[]) => {
    let pathHashmap: { [x: string]: PathFinderResult } = path.reduce(
      (made: { [x: string]: PathFinderResult }, current: PathFinderResult) => {
        return {
          ...made,
          [generateClassNameForCell(current.row, current.col)]: current,
        };
      },
      {}
    );
    let cells = Object.values(pathHashmap);
    let target = cells.filter(
      (cell: PathFinderResult, index: number) =>
        cell.type === CellType.bfsConnect
    )[0];

    let current =
      pathHashmap[
        generateClassNameForCell(target.parent.row, target.parent.col)
      ];

    let timer = setInterval(() => {
      if (
        pathHashmap[
          generateClassNameForCell(current.parent.row, current.parent.col)
        ].type === CellType.start
      ) {
        clearInterval(timer);
      }
      let cellHashMap = this.cellHashmap();
      let actualCell =
        cellHashMap[generateClassNameForCell(current.row, current.col)];
      current =
        pathHashmap[
          generateClassNameForCell(current.parent.row, current.parent.col)
        ];
      actualCell.setState({ type: CellType.actualPath });
    }, this.animateResultSpeed());
  };

  _animatePathFromEnd = (path: PathFinderResult[]) => {
    let pathHashmap: { [x: string]: PathFinderResult } = path.reduce(
      (made: { [x: string]: PathFinderResult }, current: PathFinderResult) => {
        return {
          ...made,
          [generateClassNameForCell(current.row, current.col)]: current,
        };
      },
      {}
    );
    let cells = Object.values(pathHashmap);
    let start = cells.filter(
      (cell: PathFinderResult, index: number) =>
        cell.type === CellType.bfsConnect
    )[0];

    let cellHashMap = this.cellHashmap();
    start =
      pathHashmap[generateClassNameForCell(start.parent.row, start.parent.col)];

    let timer = setInterval(() => {
      if (
        pathHashmap[
          generateClassNameForCell(start.parent.row, start.parent.col)
        ].type === CellType.target
      ) {
        clearInterval(timer);
      }
      let actualCell =
        cellHashMap[generateClassNameForCell(start.row, start.col)];
      start =
        pathHashmap[
          generateClassNameForCell(start.parent.row, start.parent.col)
        ];
      actualCell.setState({ type: CellType.actualPath });
    }, this.animateResultSpeed());
  };

  _animateResult = (result: PathFinderResult[], targetFound: boolean) => {
    // for each cell on our way color it with yellow color for testing
    for (let i = 1; i < result.length; i++) {
      let cell = result[i];
      let cellHashMap = this.cellHashmap();
      let actualCell =
        cellHashMap[generateClassNameForCell(cell.row, cell.col)];
      if (actualCell.state.type === CellType.start) continue;
      setTimeout(() => {
        actualCell.setState({ type: cell.type });
      }, i * this.animateResultSpeed());
    }
  };

  addToCellhashmap(map: BFSCellHashmap, cell: BFSCell) {
    let key = generateClassNameForCell(cell.row, cell.col);
    map[key] = cell;
  }

  cellhashmapContains(map: BFSCellHashmap, cell: BFSCell) {
    let found = map[generateClassNameForCell(cell.row, cell.col)];
    return found !== undefined;
  }
}
