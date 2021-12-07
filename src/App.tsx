import React from "react";
import "./App.css";
import PyodideWorkerProvider from "./pyodideContext/PyodideWorkerProvider";
import PyodideSlide from "./PyodideSlide";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PyodideWorkerProvider>
          <PyodideSlide />
        </PyodideWorkerProvider>
      </header>
    </div>
  );
}

export default App;
