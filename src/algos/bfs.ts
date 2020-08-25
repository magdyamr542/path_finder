import { CellType } from "../enums/enums";
import { PathFinder, PathFinderCell, PathFinderResult } from "./pathFinder";

interface BFSResult extends PathFinderResult {}
interface BFSCell extends PathFinderCell {}

export class BFS extends PathFinder {
  bfs = () => {
    let cells = this.generateCellsFromHashMap();
    let start = this.filterForCell(CellType.start);
    let target = this.filterForCell(CellType.target);
    let result: BFSResult[] = [];
    let cellFound: boolean = this.bfsUtil(start, target, cells, result);
    if (cellFound) {
      this.animate(result, true);
      return true;
    } else {
      this.animate(result, false);
      return false;
    }
  };

  bfsUtil = (
    start: BFSCell,
    target: BFSCell,
    cells: BFSCell[][],
    result: BFSResult[] // empty array at the beginning
  ): boolean => {
    let queue: BFSCell[] = []; // push the start node to the queue
    start.type = CellType.start;
    queue.push(start);
    while (queue.length !== 0) {
      let current: BFSResult = queue.shift()!;
      if (current.type !== CellType.bfsPath) {
        if (current.type !== CellType.start) current.type = CellType.bfsPath; // set the bfs path cells if not the start cell
        result.push(current);
      }
      if (this.isEqual(current, target)) {
        current.type = CellType.target; // if target then change its type
        return true;
      } // if this is the target Cell then return true

      // if not then visit  all its neighbours which have not been visited yet
      for (let cell of this.getAdjacentCells(current, cells)) {
        if (cell.type === CellType.unvisited || cell.type === CellType.target) {
          cell.parent = { row: current.row, col: current.col };
          queue.push(cell);
        }
      }
    }
    return false;
  };
}
