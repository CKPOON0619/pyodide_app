import PyodideWorker from "./pyodide.worker.js";

const pyodideWorker = new PyodideWorker("testing");

export function run(script, context, onSuccess, onError) {
  pyodideWorker.onerror = onError;
  pyodideWorker.onmessage = (e) => onSuccess(e.data);
  pyodideWorker.postMessage({
    ...context,
    python: script,
  });
}

export function asyncRun(script, context) {
  return new Promise(function (onSuccess, onError) {
    run(script, context, onSuccess, onError);
  });
}
