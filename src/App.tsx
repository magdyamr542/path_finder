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
      name: "Visited Cell",
      color: "red",
    },

    {
      name: "Unvisited Cell",
      color: "white",
    },
    {
      name: "Start Cell",
      color: "blue",
    },
    {
      name: "Target Cell",
      color: "green",
    },
    {
      name: "DFS Path Cell",
      color: "yellow",
    },
    {
      name: "DFS Callback Cell",
      color: "grey",
    },
    {
      name: "DFS Actual Path Cell",
      color: "pink",
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
