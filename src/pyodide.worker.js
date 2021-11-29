// // I think using the **cdn** is more straightforward for newcomers like me, 
// // more experienced people will now how to modify the script anyway.
// self.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/';
// importScripts('https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js');

// let pythonLoading;

// async function loadPythonPackages(){
//     await languagePluginLoader;
//     pythonLoading = self.pyodide.loadPackage(['numpy', 'pytz']);
// }

// var onmessage = async(event) => { 
//     await languagePluginLoader;
//     await pythonLoading;
//     const {python, ...args} = event.data;
//     for (const key of Object.keys(args)){
//         self[key] = args[key];
//     }
//     try {
//         self.postMessage({
//             results: await self.pyodide.runPythonAsync(python)
//         });
//     }
//     catch (error){
//         self.postMessage(
//             {error : error.message}
//         );
//     }
// }

const workerInstance=self
workerInstance.onmessage = (event)=>{
    workerInstance.postMessage(event.data)
}