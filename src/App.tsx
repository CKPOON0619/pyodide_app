import React from "react";
import logo from "./logo.svg";
import "./App.css";
// @ts-ignore
import Worker from "./pyodide.worker";
import { asyncRun } from "./py-worker";

/* eslint-disable */
function App() {
  const script = `
    import statistics
    from js import A_rank
    statistics.stdev(A_rank)
  `;

  const [result, setResult] = React.useState(null);

  const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  };

  asyncRun(script, context).then((val) => result || setResult(val));

  // const worker = new Worker();
  // worker.postMessage({
  //   question:
  //     "The Answer to the Ultimate Question of Life, The Universe, and Everything.",
  // });

  // // @ts-ignore
  // worker.onmessage = (event) => {
  //   console.log(event);
  // };

  return (
    <div className="App">
      <header className="App-header">{JSON.stringify(result)}</header>
    </div>
  );
}

export default App;
