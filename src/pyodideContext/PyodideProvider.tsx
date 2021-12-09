import * as React from "react";

import PyodideContext from "./PyodideContext";
import { PyodideRunScriptPayload, PyodideState } from "./types.js";

interface PyodideProviderProps {
  children?: React.ReactNode;
}

const PyodideProvider: React.VoidFunctionComponent<PyodideProviderProps> = ({
  children,
}) => {
  const [pyodideInstance, setPyodideInstance] = React.useState<any>(null);
  const [state, setState] = React.useState<PyodideState>({ state: "Loading" });
  const runScript = React.useCallback(
    async ({ script, context }: PyodideRunScriptPayload) => {
      try {
        setState({ state: "Loading" });
        if (context) {
          for (const key of Object.keys(context)) {
            //@ts-ignore
            window[key] = context[key];
          }
        }
        await pyodideInstance.loadPackagesFromImports(script);
        let result = await pyodideInstance.runPythonAsync(script);
        setState({ state: "Ready", return: result });
      } catch (error) {
        setState({ state: "Error", return: error });
      }
    },
    [pyodideInstance]
  );

  console.log({ pyodideInstance });
  React.useEffect(() => {
    if (!pyodideInstance) {
      //@ts-ignore
      loadPyodide({
        indexURL: "/static/js/pyodide",
      }).then(
        (pyodide: any) => {
          pyodide.loadPackage(["pandas"]);
          setPyodideInstance(pyodide);
          setState({ state: "Start" });
        }
        // (error: Error) => {
        //   console.warn("Pyodide loading failed.", error);
        // }
      );
    }
  }, [pyodideInstance]);

  return (
    <PyodideContext.Provider value={{ runScript, state, pyodideInstance }}>
      {children}
    </PyodideContext.Provider>
  );
};

export default PyodideProvider;
