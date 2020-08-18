import React, { Component } from "react";
import { Cell as CellInterface } from "../interfaces/Maze.interface";
import "../styles/Cell.css";
import { MouseStatus } from "../enums/enums";

interface State {
  free: boolean;
}

interface CellProps extends CellInterface {
  width: number;
  height: number;
  identifier: string;
  seeIfCanColorCell: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    status: string
  ) => boolean;
}

export class Cell extends Component<CellProps, State> {
  constructor(props: CellProps) {
    super(props);

    this.state = {
      free: true,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.hanldeMouseUp = this.hanldeMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  /* HANLDE MOUSE EVENTS*/
  handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let target = e.target;
    if (this.state.free) {
      this.setState({
        free: false,
      });
    } else {
      this.setState({
        free: true,
      });
    }
    this.setCellColor(
      target as HTMLDivElement,
      this.state.free ? "white" : "red"
    );
  }

  setCellColor = (element: HTMLDivElement, color: string): void => {
    element.style.backgroundColor = color;
  };

  handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.seeIfCanColorCell(e, MouseStatus.down);
    this.setCellColor(e.target as HTMLDivElement, "red");
    this.visitCell();
  }

  hanldeMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let res = this.props.seeIfCanColorCell(e, MouseStatus.up);
    this.setCellColor(e.target as HTMLDivElement, "red");
    this.visitCell();
  }

  handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let canColor = this.props.seeIfCanColorCell(e, MouseStatus.move); // it returns true if the maze knows that the mouse is down. which means that user is curretnly selecting the maze
    if (canColor) this.setCellColor(e.target as HTMLDivElement, "red");
    if (canColor) this.visitCell();
  }

  // mark the cell as visited
  visitCell = (): void => {
    this.setState({ free: false });
  };

  unVisitCell = (): void => {
    this.setState({ free: true });
  };
  render() {
    let styles = {
      width: this.props.width,
      height: this.props.height,
      marginRight: "2px",
      cursor: "pointer",
      backgroundColor: this.state.free ? "white" : "red",
    };

    return (
      <div
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.hanldeMouseUp}
        className={`cell cell_${this.props.row}_${this.props.col}`}
        style={styles}
      ></div>
    );
  }
}
