import React from "react";
import "./styles/App.css";
import { Maze } from "./components/Maze";

function App() {
  return (
    <div className="App">
      <Maze
        columnsNumber={20}
        rowsNumber={20}
        cellHeight={40}
        cellWidth={40}
      ></Maze>
    </div>
  );
}

export default App;
