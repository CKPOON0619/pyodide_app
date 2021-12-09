import React from "react";
import "./App.css";
import PyodideWorkerProvider from "./pyodideContext/PyodideWorkerProvider";
import PyodideSlide from "./PyodideSlide";

const script = `import numpy as np
import pandas as pd

from statsmodels.graphics.tsaplots import plot_predict
from statsmodels.tsa.arima_process import arma_generate_sample
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
arparams = np.array([0.75, -0.25])
maparams = np.array([0.65, 0.35])
arparams = np.r_[1, -arparams]
maparams = np.r_[1, maparams]
nobs = 250
y = arma_generate_sample(arparams, maparams, nobs)
dates = pd.date_range("1980-1-1", freq="M", periods=nobs)
y = pd.Series(y, index=dates)
res=seasonal_decompose(y)
res.resid.plot()`;
function App() {
  React.useEffect(() => {
    //@ts-ignore
    // loadPyodide({
    //   indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
    // })
    //   .then(async (pyodide: any) => {
    //     await pyodide.loadPackage(["numpy", "pandas", "statsmodels"]);
    //     return pyodide;
    //   })
    //   .then((pyodide: any) => {
    //     console.log(pyodide.runPython(script));
    //   });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {/* <PyodideWorkerProvider>
          <PyodideSlide />
        </PyodideWorkerProvider> */}
      </header>
    </div>
  );
}

export default App;
