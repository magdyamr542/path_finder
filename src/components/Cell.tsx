import React, { Component } from "react";
import { Cell as CellInterface } from "../interfaces/Maze.interface";
import "../styles/Cell.css";
import { MouseStatus, CellType } from "../enums/enums";
import { generateClassNameForCell } from "../utils/utils";

interface CellState {
  type: CellType;
  startNodePickingMode: boolean;
}
// combine it with the CellState to set the color of the cell
enum CellColor {
  visited = "red",
  unvisited = "white",
  start = "blue",
}

interface CellProps extends CellInterface {
  width: number;
  height: number;
  identifier: string;
  seeIfCanColorCell: (status: string) => boolean;
  notifyParentWhenStartNodeHasBeenClicked: () => void;
}

export class Cell extends Component<CellProps, CellState> {
  prevMouseStatus: MouseStatus;
  startNode: boolean = false;
  constructor(props: CellProps) {
    super(props);

    this.state = {
      type: CellType.unvisited,
      startNodePickingMode: false,
    };
    this.prevMouseStatus = MouseStatus.move;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.hanldeMouseUp = this.hanldeMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  setCellColor = (element: HTMLDivElement, color: string): void => {
    element.style.backgroundColor = color;
  };

  handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.seeIfCanColorCell(MouseStatus.down);
    this.prevMouseStatus = MouseStatus.down; // to notify mouse up that it is a click
    // if this is the start node
    if (this.state.startNodePickingMode) {
      this.markAsStartNode();
      return;
    }
    if (this.state.type === CellType.unvisited) this.visitCell();
    else this.unVisitCell();
  }

  markAsStartNode() {
    this.setState({
      startNodePickingMode: true,
      type: CellType.start,
    });
    this.startNode = true;
    this.props.notifyParentWhenStartNodeHasBeenClicked();
    return;
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
    if (canColor && !this.startNode) this.visitCell();
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

  render() {
    let styles = {
      width: this.props.width,
      height: this.props.height,
      marginRight: "2px",
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
