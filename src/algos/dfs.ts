import { CellHashMap } from "../interfaces/Maze.interface";
import { Cell } from "../components/Cell";
import { CellType } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";

interface DFSResult {
  row: number;
  col: number;
  type: CellType;
}
interface DFSCell extends DFSResult {}

export class DFS {
  cellHashMap: CellHashMap;
  rows: number;
  cols: number;
  animateResultSpeed: number;
  constructor(cellHashmap: CellHashMap, rows: number, cols: number) {
    this.cellHashMap = cellHashmap;
    this.rows = rows - 1; // the mapping is from 0 to rows - 1
    this.cols = cols - 1;
    this.animateResultSpeed = 30;
  }

  animate = (result: DFSResult[]) => {
    this.animateResult(result);
  };

  animateResult = (result: DFSResult[]) => {
    // for each cell on our way color it with yellow color for testing
    for (let i = 1; i < result.length - 1; i++) {
      let cell = result[i];
      let actualCell = this.cellHashMap[
        generateClassNameForCell(cell.row, cell.col)
      ];
      if (actualCell.state.type === CellType.start) continue;
      setTimeout(() => {
        actualCell.setState({ type: cell.type });
      }, i * this.animateResultSpeed);
    }
  };

  animateActualPath = (path: DFSResult[]) => {
    // for each cell on our way color it with yellow color for testing
    path.reverse();
    for (let i = 1; i < path.length - 1; i++) {
      let cell = path[i];
      let actualCell = this.cellHashMap[
        generateClassNameForCell(cell.row, cell.col)
      ];
      if (actualCell.state.type === CellType.start) continue;
      setTimeout(() => {
        actualCell.setState({ type: CellType.dfsResultPath });
      }, i * this.animateResultSpeed);
    }
  };

  dfs = () => {
    let cells = this.generateCellsFromHashMap();
    let target = this.filterForCell(CellType.target);
    let start = this.filterForCell(CellType.start);
    let result: DFSResult[] = [];
    let targetCellFound: boolean = this.dfsUtil(start, target, cells, result);
    if (targetCellFound) this.animate(result);
    else {
      this.animateResult(result);
      console.log("Sorry There is Not Path");
    }
  };

  dfsUtil = (
    current: DFSCell,
    target: DFSCell,
    cells: DFSCell[][],
    result: DFSResult[]
  ): boolean => {
    if (
      !this.isValidCell(current.row, current.col) ||
      !this.isNotVisited(current.row, current.col, cells)
    )
      return false;
    // if the current cell is equal the target then we are done
    if (this.isEqual(current, target)) {
      result.push({
        row: current.row,
        col: current.col,
        type: CellType.dfsPath,
      });
      return true;
    }
    // visit the cell
    this.visitCell(current);
    // push it to the result array for the first time
    result.push({
      row: current.row,
      col: current.col,
      type: CellType.dfsPath,
    });
    // visit all its neighbours
    for (let cell of this.getAdjacentCells(current, cells)) {
      let found = this.dfsUtil(cell, target, cells, result);
      if (found) return true;
    }
    result.push({
      row: current.row,
      col: current.col,
      type: CellType.dfsReturnPath,
    });
    return false;
  };

  generateCellsFromHashMap = (): DFSCell[][] => {
    let cells = [];
    // push the rows
    for (let i = 0; i <= this.rows; i++) {
      let currentRow: DFSCell[] = [];
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
  checkIfReadyToPerformDFS = (): boolean => {
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

  isNotVisited = (row: number, col: number, cells: DFSCell[][]): boolean => {
    return cells[row][col].type !== CellType.visited;
  };

  getAdjacentCells = (current: DFSCell, cells: DFSCell[][]): DFSCell[] => {
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
  visitCell = (cell: DFSCell) => {
    cell.type = CellType.visited;
  };

  isEqual = (cell: DFSCell, anotherCell: DFSCell) => {
    return cell.col === anotherCell.col && cell.row === anotherCell.row;
  };

  filterForCell = (type: CellType): DFSCell => {
    let cell = Object.values(this.cellHashMap).filter(
      (cell: Cell) => cell.state.type === type
    )[0];
    return {
      row: cell.props.row,
      col: cell.props.col,
      type: cell.state.type,
    };
  };

  getCell = (row: number, col: number, cells: DFSCell[][]): DFSCell | null => {
    if (this.isValidCell(row, col)) {
      return cells[row][col];
    }
    return null;
  };
}
