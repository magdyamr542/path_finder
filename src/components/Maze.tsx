import React, { Component } from "react";
import { Cell, MouseEvents, CellHashMap } from "../interfaces/Maze.interface";
import { Cell as CellComponent } from "./Cell";
import { MouseStatus, CellPickingMode, CellType } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";
import { DFS } from "../algos/dfs";
import { BFS } from "../algos/bfs";
import { AStar } from "../algos/AStar";
import { BestFirst } from "../algos/bestFirst";
import { BidirectionalBFS } from "../algos/BidirectionalBfs";

import "../styles/Maze.css";

interface Props {
  columnsNumber: number;
  rowsNumber: number;
  cellWidth: number;
  cellHeight: number;
}

interface State {
  rows: Cell[][];
}

export class Maze extends Component<Props, State> {
  dfs: DFS;
  bfs: BFS;
  bidirectionalBfs: BidirectionalBFS;
  aStar: AStar;
  bestFirst: BestFirst;

  mouseEvents: MouseEvents = {
    down: false,
  };
  prevMouseStatus: MouseStatus = MouseStatus.move;
  cellRefs: CellComponent[];
  cellHashMap: CellHashMap;
  pickingStartNode: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      rows: [],
    };
    this.cellRefs = [];
    this.cellHashMap = {};
    this.dfs = new DFS(this.cellHashMap, props.rowsNumber, props.columnsNumber);
    this.bfs = new BFS(this.cellHashMap, props.rowsNumber, props.columnsNumber);
    this.bidirectionalBfs = new BidirectionalBFS(
      this.cellHashMap,
      props.rowsNumber,
      props.columnsNumber
    );
    this.aStar = new AStar(
      this.cellHashMap,
      props.rowsNumber,
      props.columnsNumber
    );

    this.bestFirst = new BestFirst(
      this.cellHashMap,
      props.rowsNumber,
      props.columnsNumber
    );

    /* bad solution but whatever */
    this._listenForSpeedChanges();
  }

  private _listenForSpeedChanges() {
    this.dfs.eventEmitter.on("speed_changed", (speed: string) => {
      this.dfs.animateResultSpeed(parseInt(speed));
    });

    this.bfs.eventEmitter.on("speed_changed", (speed: string) => {
      this.bfs.animateResultSpeed(parseInt(speed));
    });

    this.aStar.eventEmitter.on("speed_changed", (speed: string) => {
      this.aStar.animateResultSpeed(parseInt(speed));
    });

    this.bidirectionalBfs.eventEmitter.on("speed_changed", (speed: string) => {
      this.bidirectionalBfs.animateResultSpeed(parseInt(speed));
    });

    this.bestFirst.eventEmitter.on("speed_changed", (speed: string) => {
      this.bestFirst.animateResultSpeed(parseInt(speed));
    });
  }

  // generating the cells
  generateCells = (): Cell[][] => {
    let { columnsNumber, rowsNumber } = this.props;
    let rows: Cell[][] = [];
    for (let i = 0; i < rowsNumber; i++) {
      let row: Cell[] = [];
      for (let j = 0; j < columnsNumber; j++) {
        let cell: Cell = {
          row: i,
          col: j,
          free: true,
        };
        row.push(cell);
      }
      rows.push(row);
    }
    return rows;
  };

  // set the state when the component mounts
  componentDidMount() {
    let rows: Cell[][] = this.generateCells();
    this.setState({
      rows,
    });
  }

  // generate the hash map for the cells after component renders
  componentDidUpdate() {
    this.cellHashMap = this.createCellsHashMap();
    console.log(this.cellHashMap);
  }

  // check if you can color the cell and alert the child component to color it and change its state
  seeIfCanColorCell = (status: string): boolean => {
    if (status === MouseStatus.down) this.mouseEvents.down = true;
    else if (status === MouseStatus.up) this.mouseEvents.down = false;
    if (this.mouseEvents.down) {
      return true;
    }
    return false;
  };

  // create a hash map for react cell Components
  // so you can grap a cell Component in O(1) with its identifier which is of form "cell_row_col"7
  createCellsHashMap = (): CellHashMap => {
    let map: CellHashMap = {};
    return this.cellRefs.reduce((prev: CellHashMap, current: CellComponent) => {
      return { ...prev, [current.props.identifier]: current };
    }, map);
  };

  // getting a cell component from the cells hashmap
  getReactCellComponent = (row: number, col: number): CellComponent => {
    let cellIdentifier: string = generateClassNameForCell(row, col);
    return this.cellHashMap[cellIdentifier];
  };

  // reseting the maze
  resetMaze = (): void => {
    Object.values(this.cellHashMap).forEach((cell: CellComponent) => {
      cell.unVisitCell();
    });
  };

  // reseting everything but the bolcks
  resetMazeAndKeepBlocks = (): void => {
    Object.values(this.cellHashMap).forEach((cell: CellComponent) => {
      let type = cell.state.type;
      if (
        type !== CellType.visited &&
        type !== CellType.target &&
        type !== CellType.start
      )
        cell.unVisitCell();
    });
  };

  // a template row consists of Cell Components that are rendered next to each other
  generateTemplateRow = (row: Cell[]) => {
    return row.map((cell: Cell, i: number) => {
      return (
        <CellComponent
          row={cell.row}
          col={cell.col}
          free={cell.free}
          key={generateClassNameForCell(cell.row, cell.col)}
          height={this.props.cellHeight}
          width={this.props.cellWidth}
          seeIfCanColorCell={this.seeIfCanColorCell}
          identifier={generateClassNameForCell(cell.row, cell.col)}
          ref={(comp) => this.cellRefs.push(comp!)}
          notifyParentWhenCellWithSomeTypeHasBeenClicked={
            this.getNotifiedWhenCellWithSomeTypeIsPicked
          }
        ></CellComponent>
      );
    });
  };

  pickCellWithSomeType = (type: CellPickingMode) => {
    // notify all the cells that picking start node mode is on
    Object.values(this.cellHashMap).forEach((cell: CellComponent) => {
      cell.setState({
        cellPickingMode: type,
      });
    });
  };

  getNotifiedWhenCellWithSomeTypeIsPicked = () => {
    // notify all the cells that picking start node mode is off
    Object.values(this.cellHashMap).forEach((cell: CellComponent) => {
      if (cell.state.cellPickingMode !== CellPickingMode.normal) {
        cell.setState({
          cellPickingMode: CellPickingMode.normal,
        });
      }
    });
  };

  startDFS = () => {
    this.dfs.cellHashmap(this.cellHashMap);
    let isReady: boolean = this.dfs.checkIfReadyToPerformPathFinding(); // it is ready if we have only one target and one start node
    if (isReady) {
      this.dfs.dfs();
    } else
      console.error(
        "Please make sure to start one Start Cell and One Target Cell"
      );
  };

  startBFS = () => {
    this.bfs.cellHashmap(this.cellHashMap);
    let isReady: boolean = this.bfs.checkIfReadyToPerformPathFinding(); // it is ready if we have only one target and one start node
    if (isReady) {
      let found = this.bfs.bfs();
      if (found) console.log("Found");
      else console.log("Didnt find");
    } else
      console.error(
        "Please make sure to start one Start Cell and One Target Cell"
      );
  };

  startBidirectionalBFS = () => {
    this.bidirectionalBfs.cellHashmap(this.cellHashMap);
    let isReady: boolean = this.bidirectionalBfs.checkIfReadyToPerformPathFinding(); // it is ready if we have only one target and one start node
    if (isReady) {
      let found = this.bidirectionalBfs.bfs();
      if (found) console.log("Found");
      else console.log("Didnt find");
    } else
      console.error(
        "Please make sure to start one Start Cell and One Target Cell"
      );
  };

  startAStar = () => {
    this.aStar.cellHashmap(this.cellHashMap);
    let isReady: boolean = this.aStar.checkIfReadyToPerformPathFinding(); // it is ready if we have only one target and one start node
    if (isReady) {
      let found = this.aStar.findShortestPath();
      if (found) console.log("Found");
      else console.log("Didnt find");
    } else
      console.error(
        "Please make sure to start one Start Cell and One Target Cell"
      );
  };

  startBestFirstSearch = () => {
    this.bestFirst.cellHashmap(this.cellHashMap);
    let isReady: boolean = this.bestFirst.checkIfReadyToPerformPathFinding(); // it is ready if we have only one target and one start node
    if (isReady) {
      let found = this.bestFirst.findShortestPath();
      if (found) console.log("Found");
      else console.log("Didnt find");
    } else
      console.error(
        "Please make sure to start one Start Cell and One Target Cell"
      );
  };

  handleSpeedSliderChange() {
    const slider = document.querySelector("#myRange");
    const speed = (slider as HTMLInputElement).value;
    // handle all listeners to emit the speed
    this._notifyAllListenersAboutTheSpeed(speed);
  }
  private _notifyAllListenersAboutTheSpeed(speed: string) {
    this.dfs.eventEmitter.emit("speed_changed", speed);
    this.bfs.eventEmitter.emit("speed_changed", speed);
    this.aStar.eventEmitter.emit("speed_changed", speed);
    this.bestFirst.eventEmitter.emit("speed_changed", speed);
    this.bidirectionalBfs.eventEmitter.emit("speed_changed", speed);
  }
  // foreach cell in each row draw a cell component
  render() {
    let { rows } = this.state;

    return (
      <>
        <div className="maze">
          <div className="button-container-pick">
            <button
              className="button start"
              onClick={() => this.pickCellWithSomeType(CellPickingMode.start)}
            >
              Pick a Start Cell
            </button>

            <button
              className="button target"
              onClick={() => this.pickCellWithSomeType(CellPickingMode.target)}
            >
              Pick a target Cell
            </button>
          </div>

          <div className="button-container-reset">
            <button
              onClick={this.resetMazeAndKeepBlocks}
              className="button bd-bfs"
            >
              Reset Paths
            </button>

            <button onClick={this.resetMaze} className="button reset">
              Reset Maze
            </button>
          </div>

          <div className="button-container-search">
            <button onClick={this.startDFS} className="button dfs">
              DFS
            </button>
            <button onClick={this.startBFS} className="button bfs">
              BFS
            </button>
            <button
              onClick={this.startBidirectionalBFS}
              className="button bd-bfs"
            >
              Bidirectional BFS
            </button>

            <button onClick={this.startAStar} className="button aStar">
              A*
            </button>

            <button
              onClick={this.startBestFirstSearch}
              className="button bestFirst"
            >
              Best First
            </button>
          </div>

          {/* speed slider */}

          <div className="slidecontainer">
          <h3> Visualization Speed ( go left to make it faster ) </h3>
            <input
              type="range"
              min="1"
              max="20"
              className="slider"
              id="myRange"
              onChange={() => this.handleSpeedSliderChange()}
              defaultValue="10"
            />
          </div>

          <div className="mazeContainer">
            {rows.map((row: Cell[], i: number) => {
              return (
                <div key={`row row_${i}`} className={`row row_${i}`}>
                  {this.generateTemplateRow(row)}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
