import React from "react";
import "./App.css";
import PyodideProvider from "./pyodideContext/PyodideProvider";
import PyodideWorkerProvider from "./pyodideWorkerContext/PyodideWorkerProvider";
import PyodideWorkerSlide from "./PyodideWorkerSlide";
import PyodideSlide from "./PyodideSlide";
import { Switch, Form } from "antd";

const script = `
import matplotlib.pyplot as plt
import io, base64

fig, ax = plt.subplots()
ax.plot([1,3,2])

buf = io.BytesIO()
fig.savefig(buf, format='png')
buf.seek(0)
img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')`;
function App() {
  const [isWorkerMode, setIsWorkerMode] = React.useState<boolean>(true);
  const handleModeSwitch = React.useCallback(() => {
    setIsWorkerMode(!isWorkerMode);
  }, [isWorkerMode]);
  return (
    <div className="App">
      <header className="App-header">
        <Form.Item label="Worker Mode:">
          <Switch checked={isWorkerMode} onChange={handleModeSwitch} />
        </Form.Item>

        <PyodideProvider>
          <PyodideWorkerProvider>
            {isWorkerMode ? <PyodideWorkerSlide /> : <PyodideSlide />}
          </PyodideWorkerProvider>
        </PyodideProvider>
      </header>
    </div>
  );
}

export default App;
