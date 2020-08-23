import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";
import { MazeLegend } from "./components/MazeLegend";
import { LegendItem } from "./interfaces/Maze.interface";

function App() {
  let cols = 30;
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
