import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";
import { MazeLegend } from "./components/MazeLegend";
import { LegendItem } from "./interfaces/Maze.interface";

function App() {
  let cols = 20;
  let rows = 20;
  let cellDimension = 40;

  let legendItems: LegendItem[];

  legendItems = [
    {
      name: "Visited Node",
      color: "red",
    },

    {
      name: "Unvisited Node",
      color: "white",
    },
    {
      name: "Start Node",
      color: "blue",
    },
    {
      name: "Target Node",
      color: "green",
    },
  ];

  return (
    <div className="App">
      <MazeLegend items={legendItems}></MazeLegend>
      <Maze
        columnsNumber={cols}
        rowsNumber={rows}
        cellHeight={cellDimension}
        cellWidth={cellDimension}
      ></Maze>
    </div>
  );
}

export default App;
