import * as React from "react";
import { PyodidePayLoad } from ".";

export interface PyodideWorkerContextValue {
  runScript: ({ context, script }: PyodidePayLoad) => any;
  restart: () => void;
}

const PyodideWorkerContext = React.createContext<PyodideWorkerContextValue>({
  runScript: () => {
    throw new Error("Pyodide Provider values not initiated.");
  },
  restart: () => {
    throw new Error("Pyodide Provider values not initiated.");
  },
});

export default PyodideWorkerContext;
