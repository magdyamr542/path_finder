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

export interface LegendItem {
  name: string;
  color: string;
}

export interface SimpleRectInterface {
  dims: number;
  color: string;
}
