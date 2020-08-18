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
  styles = {
    width: this.props.width,
    height: this.props.height,
    marginRight: "2px",
    cursor: "pointer",
    backgroundColor: this.props.free ? "white" : "black",
  };

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

  handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    let target = e.target;
    this.setCellColor(target as HTMLDivElement, "red");
    this.setState({
      free: false,
    });
  }

  setCellColor = (element: HTMLDivElement, color: string): void => {
    element.style.backgroundColor = color;
  };

  handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.seeIfCanColorCell(e, MouseStatus.down);
    this.setCellColor(e.target as HTMLDivElement, "red");
    this.setState({ free: false });
  }

  hanldeMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let res = this.props.seeIfCanColorCell(e, MouseStatus.up);
    this.setCellColor(e.target as HTMLDivElement, "red");
    this.setState({ free: false });
  }

  handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let canColor = this.props.seeIfCanColorCell(e, MouseStatus.move); // it returns true if the maze knows that the mouse is down. which means that user is curretnly selecting the maze
    if (canColor) this.setCellColor(e.target as HTMLDivElement, "red");
    this.setState({ free: false });
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.hanldeMouseUp}
        className={`cell cell_${this.props.row}_${this.props.col}`}
        style={this.styles}
      ></div>
    );
  }
}
