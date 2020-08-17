import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";

function App() {
  return (
    <div className="App">
      <Maze
        columnsNumber={10}
        rowsNumber={10}
        cellHeight={50}
        cellWidth={50}
      ></Maze>
    </div>
  );
}

export default App;
