import React from "react";
import {
  LegendItem as LegendItemInterface,
  SimpleRectInterface,
} from "../interfaces/Maze.interface";

interface Props {
  items: LegendItemInterface[];
}

// it takes width height and its color.
export const SimpleRect = ({ dims, color }: SimpleRectInterface) => {
  let simpleRectStyle = {
    display: "inline-block",
    marginLeft: "3px",
    backgroundColor: color,
    width: dims,
    height: dims,
    border: "1px solid black",
  };
  return <div style={simpleRectStyle}></div>;
};

// a label and then a name
export const LegendItem = ({ color, name }: LegendItemInterface) => {
  let legendItemStyle = {
    display: "flex",
  };
  return (
    <div className="legendItem" style={legendItemStyle}>
      <div style={{ fontWeight: "bold" }}>{name}</div>
      <SimpleRect dims={20} color={color}></SimpleRect>
    </div>
  );
};

// maze legend contains some legend items
export const MazeLegend = ({ items }: Props) => {
  let mazeLegendStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "25px 15%",
  };
  return (
    <div className="mazeLegend" style={mazeLegendStyle}>
      {items.map((item: LegendItemInterface, i: number) => {
        return (
          <LegendItem
            name={item.name}
            color={item.color}
            key={item.name}
          ></LegendItem>
        );
      })}
    </div>
  );
};
