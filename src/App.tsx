import React from "react";
import "./App.css";
// @ts-ignore
import PyodideProvider from "./pyodideContext/PyodideProvider";
import PyodideSlide from "./PyodideSlide"; /* eslint-disable */

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PyodideProvider>
          <PyodideSlide />
        </PyodideProvider>
      </header>
    </div>
  );
}

export default App;
