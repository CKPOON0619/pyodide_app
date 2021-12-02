import * as React from "react";
import PyodideContext from "./PyodideContext";
import { PyodideState, PyodidePayLoad } from "./types";

export function usePyodide() {
  const PyodideContextValue: any = React.useContext(PyodideContext);
  if (!PyodideContextValue) {
    throw new Error(
      "Pyodide not provided via React context. Did you forget to wrap your component with <PyodideProvider />?"
    );
  }

  const { asyncRun } = PyodideContextValue;
  const [state, setState] = React.useState<PyodideState>({
    state: "Start",
  });
  const execScript = React.useCallback(
    ({ packages, context, script }: PyodidePayLoad) => {
      setState({ state: "Loading" });
      const runResult = asyncRun({
        packages,
        context,
        script,
      });
      runResult.then((res: any) => {
        setState({ state: "Ready", return: res.data });
      });
    },
    [asyncRun]
  );

  return {
    execScript,
    state,
  };
}
