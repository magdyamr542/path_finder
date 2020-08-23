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
    let bfsResult: BFSResult[] = this.bfsUtil(start, target, cells, result);
    console.log(bfsResult);
    this.animate(result);
    return true;
  };

  bfsUtil = (
    start: BFSCell,
    target: BFSCell,
    cells: BFSCell[][],
    result: BFSResult[] // empty array at the beginning
  ): BFSResult[] => {
    let queue: BFSCell[] = []; // push the start node to the queue
    queue.push(start);
    while (queue.length !== 0) {
      let current: BFSResult = queue.shift()!;
      if (current.type !== CellType.bfsPath) {
        current.type = CellType.bfsPath;
        result.push(current);
      }
      if (this.isEqual(current, target)) return result; // if this is the target Cell then return true
      // if not then visit  all its neighbours which have not been visited yet
      for (let cell of this.getAdjacentCells(current, cells)) {
        if (cell.type !== CellType.bfsPath && cell.type !== CellType.visited) {
          queue.push(cell);
        }
      }
    }
    return result;
  };
}
