import * as React from "react";

export function usePyodideNoContext() {
  // @ts-ignore
  let pyodide = loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });

  console.log(pyodide);
}
