import PyodideWorker from "./pyodide.worker.js";

const pyodideWorker = new PyodideWorker();

export function run(script, context, onSuccess, onError) {
  console.log({ pyodideWorker });
  pyodideWorker.onerror = onError;
  pyodideWorker.onmessage = (e) => onSuccess(e.data);
  pyodideWorker.postMessage({
    ...context,
    python: script,
  });
}

// Transform the run (callback) form to a more modern async form:
export function asyncRun(script, context) {
  console.log({ script, context });
  return new Promise(function (onSuccess, onError) {
    console.log("here?");
    run(script, context, onSuccess, onError);
  });
}
