# Project description:
This is an experimental project to test implementation of pyodide with react. 
There are two different implementations here. One is through webworker and the other one is implemented on the main. 

# Web worker 
### > Pyodide.worker.js
Web worker implementation imports the script and load pyodide scripts in web worker context.
### >> PyodideWorkerProvider
To connect components with the pyodide worker, `<PyodideWorkerProvider/>` is created to control the webworker. 
It provides an api to send python script to the webworker and to restart the webworker if needed. (Pyodide is a little bit flaky at current version(0.18.1) and the instance could clash in some cases, `restart` would terminate the worker and thus the clashed pyodide instance.)
Inside the provider, it uses a promise to track the script execution on the webworker. The callbacks from the promise listens to webworker's onError and onSuccess.
### >>> usePyodideWorker
To handle the async execution and show the stages of execution in UI, `usePyodideWorker` hook is created to handle the state of execution of the script.

# Main
Main implementation import the script at the main thread without an extra layer of web worker. The implementation is therefore simplier.
### > PyodideProvider
PyodideProvider loads and hold pyodide directly. It provides an interface function `runScript` for script execution and it also provides the state of execution to the component directly.

# Findings
- Some of the libraries may not work within the worker context. For instance, plot by matplotlib is not possible.
- Certain code written in fortran in scipy could not work properly [#1440](https://github.com/pyodide/pyodide/issues/1440) and there are probably more similar cases.
- The repo currently(10/12/2021) contains 200+ issues meaning that a lot of the packages could as well be flaky.


