import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";
import { MazeLegend } from "./components/MazeLegend";
import { LegendItem } from "./interfaces/Maze.interface";

function App() {
  let cols = 30;
  let rows = 15;
  let cellDimension = 40;

  let legendItems: LegendItem[];

  legendItems = [
    {
      name: "Block",
      color: "red",
    },

    {
      name: "Free",
      color: "white",
    },
    {
      name: "Start",
      color: "blue",
    },
    {
      name: "Target",
      color: "green",
    },
    {
      name: "Current Path",
      color: "yellow",
    },
    {
      name: "DFS Callback",
      color: "grey",
    },
    {
      name: "Result",
      color: "pink",
    },
  ];

  return (
    <div className="App">
      <MazeLegend items={legendItems}></MazeLegend>
      <div className="mazeOuterContainer">
        <Maze
          columnsNumber={cols}
          rowsNumber={rows}
          cellHeight={cellDimension}
          cellWidth={cellDimension}
        ></Maze>
      </div>
    </div>
  );
}

export default App;
