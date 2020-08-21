import { Cell as CellComponent } from "../components/Cell";

export interface Cell extends CellPosition {
  free: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
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
