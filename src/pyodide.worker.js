// // I think using the **cdn** is more straightforward for newcomers like me,
// // more experienced people will now how to modify the script anyway.

/* eslint-disable */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
  await self.pyodide.loadPackage(["numpy", "pytz"]);
}

let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  console.log({ pyodideReadyPromise });
  // make sure loading is done
  await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { python, ...context } = event.data;
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    await self.pyodide.loadPackagesFromImports(python);
    let results = await self.pyodide.runPythonAsync(python);
    self.postMessage({ results });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

/* eslint-disable */
// const workerInstance = self;
// workerInstance.onmessage = (event) => {
//   workerInstance.postMessage(event.data);
// };
