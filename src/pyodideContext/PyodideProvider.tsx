import * as React from "react";

/*@ts-ignore*/
import PyodideWorker from "./pyodide.worker.js";
import PyodideContext from "./PyodideContext";

interface PyodideProviderProps {
  children?: React.ReactNode;
}

const PyodideProvider: React.VoidFunctionComponent<PyodideProviderProps> = ({
  children,
}) => {
  const worker = React.useRef<any>(null);

  /*eslint-disable*/ /*@ts-ignore*/
  const runScript = (packages, context, script, onSuccess, onError) => {
    if (worker.current) {
      worker.current.onerror = onError;
      worker.current.onmessage = onSuccess;
      worker.current.postMessage({
        packages,
        context,
        script,
      });
    }
  };

  const asyncRun = React.useCallback(
    ({ packages, context, script }) => {
      return new Promise(function (onSuccess, onError) {
        runScript(packages, context, script, onSuccess, onError);
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
        pyodide: worker.current,
        asyncRun,
        runScript,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
};

export default PyodideProvider;
