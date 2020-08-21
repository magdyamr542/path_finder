import React, { Component } from "react";
import { Cell as CellInterface } from "../interfaces/Maze.interface";
import "../styles/Cell.css";
import {
  MouseStatus,
  CellType,
  CellColor,
  CellPickingMode,
} from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";

// combine it with the CellState to set the color of the cell

interface CellState {
  type: CellType;
  cellPickingMode: CellPickingMode;
}

interface CellProps extends CellInterface {
  width: number;
  height: number;
  identifier: string;
  seeIfCanColorCell: (status: string) => boolean;
  notifyParentWhenCellWithSomeTypeHasBeenClicked: () => void;
}

export class Cell extends Component<CellProps, CellState> {
  prevMouseStatus: MouseStatus;
  constructor(props: CellProps) {
    super(props);

    this.state = {
      type: CellType.unvisited,
      cellPickingMode: CellPickingMode.normal,
    };
    this.prevMouseStatus = MouseStatus.move;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.hanldeMouseUp = this.hanldeMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.seeIfCanColorCell(MouseStatus.down);
    this.prevMouseStatus = MouseStatus.down; // to notify mouse up that it is a click
    // if this is the start node
    if (this.state.cellPickingMode === CellPickingMode.start) {
      this.markAsStartCell();
      return;
    } else if (this.state.cellPickingMode === CellPickingMode.target) {
      this.markAsTargetCell();
      return;
    }

    if (this.state.type === CellType.unvisited) this.visitCell();
    else this.unVisitCell();
  }

  hanldeMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.seeIfCanColorCell(MouseStatus.up);
    // if it is a click then state changing has been taken care of by the mouse down
    if (this.prevMouseStatus === MouseStatus.down) {
      return;
    } else this.visitCell();
  }

  handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let canColor = this.props.seeIfCanColorCell(MouseStatus.move); // it returns true if the maze knows that the mouse is down. which means that user is curretnly selecting the maze
    if (canColor && this.state.type !== CellType.unvisited) return;
    if (canColor && this.state.type !== CellType.start) this.visitCell();
  }

  // mark the cell as visited
  visitCell = (): void => {
    this.setState({ type: CellType.visited });
  };

  unVisitCell = (): void => {
    this.setState({ type: CellType.unvisited });
  };

  isVisited = (): boolean => {
    return this.state.type === CellType.visited;
  };

  markAsStartCell() {
    this.setState({
      type: CellType.start,
    });
    this.props.notifyParentWhenCellWithSomeTypeHasBeenClicked();
    return;
  }

  markAsTargetCell() {
    this.setState({
      type: CellType.target,
    });
    this.props.notifyParentWhenCellWithSomeTypeHasBeenClicked();
    return;
  }

  render() {
    let styles = {
      width: this.props.width,
      height: this.props.height,
      marginRight: "1px",
      cursor: "pointer",
      backgroundColor: CellColor[this.state.type],
    };

    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.hanldeMouseUp}
        className={`cell ${generateClassNameForCell(
          this.props.row,
          this.props.col
        )}`}
        style={styles}
      ></div>
    );
  }
}
