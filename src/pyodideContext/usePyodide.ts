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

  const { asyncRun, restart: pyodideRestart } = PyodideContextValue;
  const [pyodideState, setPyodideState] = React.useState<PyodideState>({
    state: "Start",
  });

  const restart = React.useCallback(() => {
    pyodideRestart();
    setPyodideState({ state: "Start" });
  }, [pyodideRestart]);
  const execScript = React.useCallback(
    ({ packages, context, script }: PyodidePayLoad) => {
      setPyodideState({ state: "Loading" });
      const runResult = asyncRun({
        packages,
        context,
        script,
      });
      runResult.then((res: any) => {
        setPyodideState({ state: "Ready", return: res.data });
      });
    },
    [asyncRun]
  );

  return {
    restart,
    execScript,
    pyodideState,
  };
}
