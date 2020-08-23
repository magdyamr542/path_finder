import { CellType } from "../enums/enums";
import { PathFinder, PathFinderCell, PathFinderResult } from "./pathFinder";

interface DFSResult extends PathFinderResult {}
interface DFSCell extends PathFinderCell {}

export class DFS extends PathFinder {
  dfs = () => {
    let cells = this.generateCellsFromHashMap();
    let target = this.filterForCell(CellType.target);
    let start = this.filterForCell(CellType.start);
    let result: DFSResult[] = [];
    let targetCellFound: boolean = this.dfsUtil(start, target, cells, result);
    if (targetCellFound) {
      this.animate(result);
      return true;
    } else {
      this.animateResult(result);
      return false;
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
}
