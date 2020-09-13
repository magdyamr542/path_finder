import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";
import { MazeLegend } from "./components/MazeLegend";
import { LegendItem } from "./interfaces/Maze.interface";

function App() {
  let cols = 50;
  let rows = 30;
  let cellDimension = 30;

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
      <div className="app-title-container">
        <h1 className="app-title">Maze Visualiser</h1>
        <span className="app-title-line"></span>
      </div>
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
