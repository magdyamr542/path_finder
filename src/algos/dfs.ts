import { CellHashMap } from "../interfaces/Maze.interface";
import { Cell } from "../components/Cell";
import { CellType } from "../enums/enums";

export const dfs = () => {
  return null;
};

export const checkIfReadyToPerformDFS = (cellHashmap: CellHashMap): boolean => {
  let target = Object.values(cellHashmap).filter(
    (cell: Cell) => cell.state.type === CellType.target
  );
  let start = Object.values(cellHashmap).filter(
    (cell: Cell) => cell.state.type === CellType.start
  );
  console.log(target, start);

  return target.length === 1 && start.length === 1;
};
