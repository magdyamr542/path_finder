import { CellType } from "../enums/enums";
import { PathFinderResult } from "../algos/pathFinder";
import { generateClassNameForCell } from "../utils/utils";
import { CellHashMap } from "../interfaces/Maze.interface";

// animating a result array where the start and the target are not included
export const animateResult = (
  result: PathFinderResult[],
  cellHashmap: CellHashMap,
  animataResultSpeed: number
): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    for (let i = 0; i < result.length; i++) {
      let cell = result[i];
      let actualCell =
        cellHashmap[generateClassNameForCell(cell.row, cell.col)];
      setTimeout(() => {
        actualCell.setState({ type: cell.type });
        if (i === result.length - 1) resolve(1);
      }, i * animataResultSpeed);
    }
  });
};
