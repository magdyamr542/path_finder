import React, { Component } from "react";
import { Cell as CellInterface } from "../interfaces/Maze.interface";
import "../styles/Cell.css";
interface State {
  free: boolean;
}

interface CellProps extends CellInterface {
  width: number;
  height: number;
}

export class Cell extends Component<CellProps, State> {
  styles = {
    width: this.props.width,
    height: this.props.height,
    marginRight: "2px",
    cursor: "pointer",
  };
  constructor(props: CellProps) {
    super(props);
    this.setState({
      free: true,
    });
  }

  render() {
    return (
      <div
        className={`cell cell_${this.props.row}_${this.props.col}`}
        style={this.styles}
      ></div>
    );
  }
}
