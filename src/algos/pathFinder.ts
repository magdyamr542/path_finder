import { CellHashMap } from "../interfaces/Maze.interface";
import { Cell } from "../components/Cell";
import { CellType } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";

export interface PathFinderResult {
  row: number;
  col: number;
  type: CellType;
}
export interface PathFinderCell extends PathFinderResult {}

export class PathFinder {
  cellHashMap: CellHashMap;
  rows: number;
  cols: number;
  _animateResultSpeed: number = 50;
  constructor(cellHashmap: CellHashMap, rows: number, cols: number) {
    this.cellHashMap = cellHashmap;
    this.rows = rows - 1; // the mapping is from 0 to rows - 1
    this.cols = cols - 1;
  }

  animate = (result: PathFinderResult[]) => {
    this.animateResult(result);
  };

  animateResult = (result: PathFinderResult[]) => {
    // for each cell on our way color it with yellow color for testing
    console.log("The speed of animatin is", this.animateResultSpeed());

    for (let i = 1; i < result.length - 1; i++) {
      let cell = result[i];
      let actualCell = this.cellHashMap[
        generateClassNameForCell(cell.row, cell.col)
      ];
      if (actualCell.state.type === CellType.start) continue;
      setTimeout(() => {
        actualCell.setState({ type: cell.type });
      }, i * this.animateResultSpeed());
    }
  };

  generateCellsFromHashMap = (): PathFinderCell[][] => {
    let cells = [];
    // push the rows
    for (let i = 0; i <= this.rows; i++) {
      let currentRow: PathFinderCell[] = [];
      for (let j = 0; j <= this.cols; j++) {
        let currentCell: Cell = this.cellHashMap[
          generateClassNameForCell(i, j)
        ];
        currentRow.push({
          row: currentCell.props.row,
          col: currentCell.props.col,
          type: currentCell.state.type,
        });
      }
      cells.push(currentRow);
    }
    return cells;
  };

  // pre proccessing to see if there is one target and one source node or nor
  checkIfReadyToPerformPathFinding = (): boolean => {
    let target = Object.values(this.cellHashMap).filter(
      (cell: Cell) => cell.state.type === CellType.target
    );
    let start = Object.values(this.cellHashMap).filter(
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

  isEqual = (cell: PathFinderCell, anotherCell: PathFinderCell) => {
    return cell.col === anotherCell.col && cell.row === anotherCell.row;
  };

  filterForCell = (type: CellType): PathFinderCell => {
    let cell = Object.values(this.cellHashMap).filter(
      (cell: Cell) => cell.state.type === type
    )[0];
    return {
      row: cell.props.row,
      col: cell.props.col,
      type: cell.state.type,
    };
  };

  getCell = (
    row: number,
    col: number,
    cells: PathFinderCell[][]
  ): PathFinderCell | null => {
    if (this.isValidCell(row, col)) {
      return cells[row][col];
    }
    return null;
  };

  // getters and setters for the animating speed
  animateResultSpeed(speed: number): this;
  animateResultSpeed(): number;
  animateResultSpeed(speed?: number): this | number {
    if (!arguments.length) return this._animateResultSpeed;
    this._animateResultSpeed = speed!;
    return this;
  }
}
