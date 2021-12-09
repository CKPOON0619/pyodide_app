import * as React from "react";
import PyodideWorkerContext, {
  PyodideWorkerContextValue,
} from "./PyodideWorkerContext";
import { PyodideState, PyodidePayLoad } from "./types";

export function usePyodideWorker() {
  const PyodideWorkerContextValue =
    React.useContext<PyodideWorkerContextValue>(PyodideWorkerContext);
  if (!PyodideWorkerContextValue) {
    throw new Error(
      "Pyodide not provided via React context. Did you forget to wrap your component with <PyodideProvider />?"
    );
  }

  const { runScript, restart: pyodideRestart } = PyodideWorkerContextValue;
  const [pyodideState, setPyodideState] = React.useState<PyodideState>({
    state: "Start",
  });

  const restart = React.useCallback(() => {
    pyodideRestart();
    setPyodideState({ state: "Start" });
  }, [pyodideRestart]);

  const execScript = React.useCallback(
    ({ context, script }: PyodidePayLoad) => {
      setPyodideState({ state: "Loading" });
      const runResult = runScript({
        context,
        script,
      });
      runResult.then((res: any) => {
        setPyodideState({ state: "Ready", return: res.data });
      });
    },
    [runScript]
  );

  return {
    restart,
    execScript,
    pyodideState,
  };
}
