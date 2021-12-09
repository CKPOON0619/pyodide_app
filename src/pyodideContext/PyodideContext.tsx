import * as React from "react";
import { PyodideRunScript } from ".";
import { PyodidePayLoad } from "./types";

interface PyodideContextValue {
  asyncRun: ({ packages, context, script }: PyodidePayLoad) => any;
  runScript: ({
    packages,
    context,
    script,
    onSuccess,
    onError,
  }: PyodideRunScript) => any;
  restart: () => void;
}

const PyodideContext = React.createContext<PyodideContextValue>({
  asyncRun: () => {
    throw new Error("Pyodide Provider values not initiated.");
  },
  runScript: () => {
    throw new Error("Pyodide Provider values not initiated.");
  },
  restart: () => {
    throw new Error("Pyodide Provider values not initiated.");
  },
});

export default PyodideContext;
