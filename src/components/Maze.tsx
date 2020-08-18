import React, { Component } from "react";
import { Cell, MouseEvents, CellHashMap } from "../interfaces/Maze.interface";
import { Cell as CellComponent } from "./Cell";
import { MouseStatus } from "../enums/enums";

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
  cellRefs: CellComponent[];
  cellHashMap: CellHashMap;
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
  }

  // check if you can color the cell and alert the child component to color it and change its state
  seeIfCanColorCell = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    status: string
  ): boolean => {
    if (status == MouseStatus.down) this.mouseEvents.down = true;
    else if (status == MouseStatus.up) this.mouseEvents.down = false;
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

  // getting a cell component
  getReactCellComponent = (row: number, col: number): CellComponent => {
    let cell: CellComponent = this.cellRefs.filter(
      (cell: CellComponent) => cell.props.row == row && cell.props.col == col
    )[0];
    return cell;
  };
  // a template row consists of Cell Components that are rendered next to each other
  generateTemplateRow = (row: Cell[]) => {
    return row.map((cell: Cell, i: number) => {
      return (
        <CellComponent
          row={cell.row}
          col={cell.col}
          free={cell.free}
          key={`cell_${cell.row}_${cell.col}`}
          height={this.props.cellHeight}
          width={this.props.cellWidth}
          seeIfCanColorCell={this.seeIfCanColorCell}
          identifier={`cell_${cell.row}_${cell.col}`}
          ref={(comp) => this.cellRefs.push(comp!)}
        ></CellComponent>
      );
    });
  };

  // foreach cell in each row draw a cell component
  render() {
    let { rows } = this.state;
    console.log(this);

    return (
      <>
        {rows.map((row: Cell[], i: number) => {
          return (
            <div key={`row row_${i}`} className={`row row_${i}`}>
              {this.generateTemplateRow(row)}
            </div>
          );
        })}
      </>
    );
  }
}
