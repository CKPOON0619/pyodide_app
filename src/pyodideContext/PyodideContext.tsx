import * as React from "react";
import { PyodideContextValue } from "./types";

const PyodideContext = React.createContext<PyodideContextValue>({
  runScript: () => {},
  pyodideInstance: undefined,
  state: undefined,
});

export default PyodideContext;
