import * as React from "react";

/*@ts-ignore*/
import PyodideWorker from "./pyodide.worker.js";
import PyodideContext from "./PyodideContext";
import { PyodidePayLoad, PyodideRunScript } from "./types.js";

interface PyodideProviderProps {
  children?: React.ReactNode;
}

const PyodideWorkerProvider: React.VoidFunctionComponent<PyodideProviderProps> =
  ({ children }) => {
    const worker = React.useRef<any>(null);

    const runScript = React.useCallback(
      ({ packages, context, script, onSuccess, onError }: PyodideRunScript) => {
        if (worker.current) {
          worker.current.onerror = onError;
          worker.current.onmessage = onSuccess;
          worker.current.postMessage({
            packages,
            context,
            script,
          });
        }
      },
      []
    );

    const asyncRun = React.useCallback(
      ({ packages, context, script }: PyodidePayLoad) => {
        return new Promise(function (onSuccess, onError) {
          runScript({ packages, context, script, onSuccess, onError });
        });
      },
      [runScript]
    );

    React.useEffect(() => {
      if (!worker.current) {
        worker.current = new PyodideWorker();
      }

      return () => {
        if (worker.current) {
          worker.current.terminate();
          worker.current = null;
        }
      };
    }, []);

    return (
      <PyodideContext.Provider
        value={{
          asyncRun,
          runScript,
        }}
      >
        {children}
      </PyodideContext.Provider>
    );
  };

export default PyodideWorkerProvider;
