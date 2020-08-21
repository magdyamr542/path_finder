export enum MouseStatus {
  up = "up",
  down = "down",
  move = "move",
}

export enum CellType {
  start = "start",
  visited = "visited",
  unvisited = "unvisited",
  target = "target",
}

export enum CellColor {
  visited = "red",
  unvisited = "white",
  start = "blue",
  target = "green",
}

export enum CellPickingMode {
  start = "start",
  target = "target",
  normal = "normal",
}
