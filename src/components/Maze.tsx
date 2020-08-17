import React, { Component } from "react";
import { Cell } from "../interfaces/Maze.interface";
import { Cell as CellComponent } from "./Cell";

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
  constructor(props: Props) {
    super(props);
    this.state = {
      rows: [],
    };
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
        ></CellComponent>
      );
    });
  };

  // foreach cell in each row draw a cell component
  render() {
    let { rows } = this.state;
    return rows.map((row: Cell[], i: number) => {
      return (
        <div key={`row row_${i}`} className={`row row_${i}`}>
          {this.generateTemplateRow(row)}
        </div>
      );
    });
  }
}
