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
  dfsPath = "dfsPath",
  dfsReturnPath = "dfsReturnPath",
  bfsPath = "bfsPath",
  actualPath = "actualPath",
  bfsConnect = "bfsConnect",
  aStarVisited = "aStarVisited",
  aStarVisiting = "aStarVisiting",
  aStarShortestPath = "aStarShortestPath",
}

export enum CellColor {
  visited = "red",
  unvisited = "white",
  start = "blue",
  target = "green",
  dfsPath = "yellow",
  dfsReturnPath = "grey",
  bfsPath = "yellow",
  actualPath = "pink",
  bfsConnect = "pink",
  aStarVisited = "purple",
  aStarVisiting = "grey",
  aStarShortestPath = "orange",
}

export enum CellPickingMode {
  start = "start",
  target = "target",
  normal = "normal",
}
