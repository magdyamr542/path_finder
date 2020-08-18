import { Cell as CellComponent } from "../components/Cell";

export interface Cell {
  col: number;
  row: number;
  free: boolean;
}

export interface MouseEvents {
  down: boolean;
}

export interface CellHashMap {
  [identifier: string]: CellComponent;
}
