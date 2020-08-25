import { CellType } from "../enums/enums";
import { PathFinder, PathFinderCell, PathFinderResult } from "./pathFinder";
import { Queue } from "../datastructures/queue";

interface BFSResult extends PathFinderResult {}
interface BFSCell extends PathFinderCell {}

export class BFS extends PathFinder {
  bfs = () => {
    let cells = this.generateCellsFromHashMap();
    let start = this.filterForCell(CellType.start);
    let target = this.filterForCell(CellType.target);
    let result: BFSResult[] = [];
    let timeStart = performance.now();
    let cellFound: boolean = this.bfsUtil(start, target, cells, result);
    let timeEnd = performance.now();
    console.log("The time for bfs in seconds is ", timeEnd / timeStart / 1000);
    console.log("RESULT BFS", result);

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
    let queue = new Queue<BFSCell>();
    // let queue: BFSCell[] = []; // push the start node to the queue
    start.type = CellType.start;
    queue.enqueue(start);
    while (!queue.isEmpty()) {
      let current: BFSResult = queue.dequeue();
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
          queue.enqueue(cell);
        }
      }
    }
    return false;
  };
}
