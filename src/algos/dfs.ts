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
    start.parent = { row: -1, col: -1 };
    start.type = CellType.start;
    let targetCellFound: boolean = this.dfsUtil(start, target, cells, result);
    this.animate(result, targetCellFound);
    return targetCellFound;
  };

  dfsUtil = (
    current: DFSCell,
    target: DFSCell,
    cells: DFSCell[][],
    result: DFSResult[]
  ): boolean => {
    console.log("inside dfs util");

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
        type: CellType.target,
        parent: current.parent,
      });
      return true;
    }
    // visit the cell
    if (current.type !== CellType.start) this.visitCell(current);
    // push it to the result array for the first time
    result.push({
      row: current.row,
      col: current.col,
      type: current.type === CellType.start ? CellType.start : CellType.dfsPath,
      parent: current.parent,
    });
    // visit all its neighbours
    for (let cell of this.getAdjacentCells(current, cells)) {
      if (cell.type === CellType.unvisited || cell.type === CellType.target) {
        cell.parent = { row: current.row, col: current.col }; // set the parent of the cell
        let found = this.dfsUtil(cell, target, cells, result);
        if (found) return true;
      }
    }

    result.push({
      row: current.row,
      col: current.col,
      type:
        current.type !== CellType.start
          ? CellType.dfsReturnPath
          : CellType.start,
      parent: current.parent,
    });
    return false;
  };
}
