import * as React from "react";

/*@ts-ignore*/
import PyodideWorker from "./pyodide.worker.js";
import PyodideWorkerContext from "./PyodideWorkerContext";
import { PyodidePayLoad, PyodideRunScript } from "./types.js";

interface PyodideProviderProps {
  children?: React.ReactNode;
}

const PyodideWorkerProvider: React.VoidFunctionComponent<PyodideProviderProps> =
  ({ children }) => {
    const worker = React.useRef<any>(null);
    const [shouldRestart, setRestart] = React.useState<any>(false);
    const restart = React.useCallback(() => {
      setRestart(true);
    }, []);

    const setupWorker = React.useCallback(
      ({ context, script, onSuccess, onError }: PyodideRunScript) => {
        if (worker.current) {
          worker.current.onerror = onError;
          worker.current.onmessage = onSuccess;
          worker.current.postMessage({
            context,
            script,
          });
        }
      },
      []
    );

    const runScript = React.useCallback(
      ({ context, script }: PyodidePayLoad) => {
        return new Promise(function (onSuccess, onError) {
          setupWorker({ context, script, onSuccess, onError });
        });
      },
      [setupWorker]
    );

    React.useEffect(() => {
      if (shouldRestart && worker.current) {
        worker.current.terminate();
        worker.current = null;
      }
      if (!worker.current) {
        worker.current = new PyodideWorker();
        setRestart(false);
      }

      return () => {
        if (worker.current) {
          worker.current.terminate();
          worker.current = null;
        }
      };
    }, [shouldRestart]);

    return (
      <PyodideWorkerContext.Provider
        value={{
          restart,
          runScript,
        }}
      >
        {children}
      </PyodideWorkerContext.Provider>
    );
  };

export default PyodideWorkerProvider;
