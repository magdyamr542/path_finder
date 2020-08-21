import React, { Component } from "react";
import { Cell, MouseEvents, CellHashMap } from "../interfaces/Maze.interface";
import { Cell as CellComponent } from "./Cell";
import { MouseStatus, CellPickingMode } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";

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
    console.log("DFS Starting");
  };
  // foreach cell in each row draw a cell component
  render() {
    let { rows } = this.state;

    return (
      <>
        <button onClick={this.resetMaze}>Reset Maze</button>
        <button
          onClick={() => this.pickCellWithSomeType(CellPickingMode.start)}
        >
          Pick a Start Node
        </button>
        <button
          onClick={() => this.pickCellWithSomeType(CellPickingMode.target)}
        >
          Pick a target Node
        </button>

        <button onClick={this.startDFS}>Start A DFS</button>

        <div className="mazeContainer">
          {rows.map((row: Cell[], i: number) => {
            return (
              <div key={`row row_${i}`} className={`row row_${i}`}>
                {this.generateTemplateRow(row)}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
