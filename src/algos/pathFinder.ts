import { CellHashMap } from "../interfaces/Maze.interface";
import { Cell } from "../components/Cell";
import { CellType } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";
import { EventEmitter } from "../EventEmitter";

interface PathFinderResultParent {
  row: number;
  col: number;
}
export interface PathFinderResult {
  row: number;
  col: number;
  type: CellType;
  parent: PathFinderResultParent;
}

export type PathHashMap = { [x: string]: PathFinderResult };
export interface PathFinderCell extends PathFinderResult {}

export class PathFinder {
  _cellHashMap: CellHashMap;
  rows: number;
  cols: number;
  _stopAnimatingPath: boolean = false;
  _animateResultSpeed: number = 10;
  eventEmitter: EventEmitter<string>;
  constructor(cellHashmap: CellHashMap, rows: number, cols: number) {
    this._cellHashMap = cellHashmap;
    this.rows = rows - 1; // the mapping is from 0 to rows - 1
    this.cols = cols - 1;
    this.eventEmitter = new EventEmitter<string>();
  }

  // getting and setting the set hash map
  cellHashmap(): CellHashMap;
  cellHashmap(cellhashmap: CellHashMap): this;
  cellHashmap(cellhashmap?: CellHashMap): this | CellHashMap {
    if (!arguments.length) return this._cellHashMap;
    this._cellHashMap = cellhashmap!;
    return this;
  }

  animate = (
    result: PathFinderResult[],
    targetFound: boolean,
    _actualPath?: PathFinderResult[]
  ) => {
    let resultWithoutStartOrTarget = result.filter(
      (c) => c.type !== CellType.start && c.type !== CellType.target
    );
    this.animateResult(resultWithoutStartOrTarget, this.cellHashmap()).then(
      (res) => {
        if (targetFound) {
          let actualPath = _actualPath || this.constructActualPath(result);
          this.animateResult(actualPath, this.cellHashmap());
        }
      }
    );
  };

  constructActualPath = (
    path: PathFinderResult[],
    targetType?: CellType
  ): PathFinderResult[] => {
    let actualPath: PathFinderResult[] = [];
    let pathHashmap: PathHashMap = path.reduce(
      (made: { [x: string]: PathFinderResult }, current: PathFinderResult) => {
        return {
          ...made,
          [generateClassNameForCell(current.row, current.col)]: current,
        };
      },
      {}
    );
    // get the target cell
    let cells = Object.values(pathHashmap);
    let targetOfFilter = targetType ? targetType : CellType.target;
    let target = cells.filter(
      (cell: PathFinderResult, index: number) => cell.type === targetOfFilter
    )[0];
    // from the target cell construct the path till you reach the start cell
    let current =
      pathHashmap[
        generateClassNameForCell(target.parent.row, target.parent.col)
      ];
    while (
      current.type !== CellType.start &&
      current.type !== CellType.target
    ) {
      current.type = CellType.actualPath;
      actualPath.push(current);
      current =
        pathHashmap[
          generateClassNameForCell(current.parent.row, current.parent.col)
        ];
    }
    return actualPath;
  };

  animateActualPath = (path: PathFinderResult[]) => {
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
      (cell: PathFinderResult, index: number) => cell.type === CellType.target
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

  // animating a result array where the start and the target are not included
  animateResult = (
    result: PathFinderResult[],
    cellHashmap: CellHashMap
  ): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      for (let i = 0; i < result.length; i++) {
        if (this._stopAnimatingPath) resolve(1);
        let cell = result[i];
        let actualCell =
          cellHashmap[generateClassNameForCell(cell.row, cell.col)];
        setTimeout(() => {
          actualCell.setState({ type: cell.type });
          if (i === result.length - 1) resolve(1);
        }, i * this.animateResultSpeed());
      }
    });
  };

  generateCellsFromHashMap = (): PathFinderCell[][] => {
    let cells = [];
    let cellHashMap = this.cellHashmap();
    // push the rows
    for (let i = 0; i <= this.rows; i++) {
      let currentRow: PathFinderCell[] = [];
      for (let j = 0; j <= this.cols; j++) {
        let currentCell: Cell = cellHashMap[generateClassNameForCell(i, j)];
        currentRow.push({
          row: currentCell.props.row,
          col: currentCell.props.col,
          type: currentCell.state.type,
          parent: { row: -1, col: -1 },
        });
      }
      cells.push(currentRow);
    }
    return cells;
  };

  // pre proccessing to see if there is one target and one source node or nor
  checkIfReadyToPerformPathFinding = (): boolean => {
    let cellHashMap = this.cellHashmap();
    let target = Object.values(cellHashMap).filter(
      (cell: Cell) => cell.state.type === CellType.target
    );
    let start = Object.values(cellHashMap).filter(
      (cell: Cell) => cell.state.type === CellType.start
    );
    return target.length === 1 && start.length === 1;
  };

  isValidCell = (row: number, col: number): boolean => {
    return row >= 0 && row <= this.rows && col >= 0 && col <= this.cols;
  };

  isNotVisited = (
    row: number,
    col: number,
    cells: PathFinderCell[][]
  ): boolean => {
    return cells[row][col].type !== CellType.visited;
  };

  getAdjacentCells = (
    current: PathFinderCell,
    cells: PathFinderCell[][]
  ): PathFinderCell[] => {
    let { row, col } = current;
    let result = [];
    let rightCell = this.getCell(row, col + 1, cells);
    let leftCell = this.getCell(row, col - 1, cells);
    let upperCell = this.getCell(row + 1, col, cells);
    let bottomCell = this.getCell(row - 1, col, cells);
    if (rightCell) result.push(rightCell);
    if (leftCell) result.push(leftCell);
    if (upperCell) result.push(upperCell);
    if (bottomCell) result.push(bottomCell);
    return result;
  };
  visitCell = (cell: PathFinderCell) => {
    cell.type = CellType.visited;
  };

  isEqual = (
    cell: { row: number; col: number },
    anotherCell: { row: number; col: number }
  ) => {
    return cell.col === anotherCell.col && cell.row === anotherCell.row;
  };

  filterForCell = (type: CellType): PathFinderCell => {
    let cellHashMap = this.cellHashmap();
    let cell = Object.values(cellHashMap).filter(
      (cell: Cell) => cell.state.type === type
    )[0];
    return {
      row: cell.props.row,
      col: cell.props.col,
      type: cell.state.type,
      parent: { row: -1, col: -1 },
    };
  };

  getCell = (
    row: number,
    col: number,
    cells: PathFinderCell[][]
  ): PathFinderCell | null => {
    if (row >= 0 && row <= this.rows && col >= 0 && col <= this.cols) {
      return cells[row][col];
    } else return null;
  };

  // getters and setters for the animating speed
  animateResultSpeed(speed: number): this;
  animateResultSpeed(): number;
  animateResultSpeed(speed?: number): this | number {
    console.log("speed is ", speed);
    if (!arguments.length) return this._animateResultSpeed;
    this._animateResultSpeed = speed!;
    return this;
  }
}
