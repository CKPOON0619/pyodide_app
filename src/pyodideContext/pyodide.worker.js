/* eslint-disable */
importScripts("pyodide/pyodide.js");
async function loadPyodideInWorker() {
  self.pyodide = await loadPyodide({
    indexURL: "pyodide",
  });
  self.packages = [];
  self.initiated = true;
}

async function loadPackages(packages) {
  const loadedPackages = new Set(self.packages);
  const newPackages = packages.filter((x) => !loadedPackages.has(x));
  if (newPackages) {
    await self.pyodide.loadPackage(newPackages);
    self.packages = self.packages.concat(newPackages);
  }
}

async function executeAndPostResult(pythonScript) {
  try {
    await self.pyodide.loadPackagesFromImports(pythonScript);
    let results = await self.pyodide.runPythonAsync(pythonScript);
    self.postMessage({ results });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
}

function setContext(context) {
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
}

let pyodideReadyPromise = loadPyodideInWorker();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  const { script, packages, context } = event.data;
  if (packages) await loadPackages(packages);
  if (context) setContext(context);
  if (script) executeAndPostResult(script);
};
