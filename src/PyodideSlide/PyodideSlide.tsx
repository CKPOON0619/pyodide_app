import * as React from "react";
import { Button, Tooltip, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { refreshContextVarInScript, commentHeaders } from "./scriptHelper";
import * as CSV from "csv-string";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";

import "antd/dist/antd.css";
import { RcFile } from "antd/lib/upload";
import { PyodideContextValue, PyodideContext } from "../pyodideContext";

const PyodideSlide: React.VoidFunctionComponent = () => {
  const [script, setScript] = React.useState<string>(commentHeaders.join("\n"));
  const PyodideContextValue =
    React.useContext<PyodideContextValue>(PyodideContext);
  if (!PyodideContextValue) {
    throw new Error(
      "Pyodide not provided via React context. Did you forget to wrap your component with <PyodideProvider />?"
    );
  }

  const {
    runScript,
    state: pyodideState,
    pyodideInstance,
  } = PyodideContextValue;
  function onChange(newValue: string) {
    setScript(newValue);
  }

  const [assets, setAssets] = React.useState<Array<RcFile>>([]);
  const handleFileLoad = React.useCallback(
    (file) => {
      setAssets([...assets, file]);
      setScript(
        refreshContextVarInScript(
          Array.from(
            new Set([...assets, file].map((asset) => asset.name.split(".")[0]))
          ),
          script
        )
      );
      return false;
    },
    [assets, script]
  );
  const handleFileRemove = React.useCallback(
    (file) => {
      const newAssets = assets.filter((f: RcFile) => f.uid !== file.uid);
      setAssets(newAssets);
      setScript(
        refreshContextVarInScript(
          newAssets.map((asset) => asset.name.split(".")[0]),
          script
        )
      );
    },
    [assets, script]
  );

  const handleScriptExecute = React.useCallback(async () => {
    const fileContents = await Promise.all(
      assets.map((file: RcFile) => file.text())
    ).then((contents) => contents.map((csv) => CSV.parse(csv)));

    const context = Object.fromEntries(
      assets.map((file: RcFile, idx) => [
        file.name.split(".")[0],
        fileContents[idx],
      ])
    );
    runScript({ script, context });
  }, [runScript, script, assets]);

  const pyplots = pyodideInstance && pyodideInstance.globals.get("__figures");
  console.log({ pyplots });
  return (
    <div>
      <Upload
        accept=".txt, .csv"
        multiple={true}
        name="file"
        headers={{ authorization: "authorization-text" }}
        beforeUpload={handleFileLoad}
        onRemove={handleFileRemove}
        fileList={assets}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <div>
        <AceEditor
          mode="python"
          theme="ambiance"
          onChange={onChange}
          value={script}
          editorProps={{ $blockScrolling: true }}
        />
        <div>
          <Button onClick={handleScriptExecute}>Execute Script</Button>
        </div>
        <div style={{ fontSize: "small" }}>
          {pyodideState && pyodideState.return && pyodideState.return.error}
        </div>
        <div id="pyplotdiv">
          {pyplots && pyplots.length > 0
            ? Array(pyplots.length)
                .fill(0)
                .map((_, i) => <img key={i} src={pyplots.get(i)} alt="" />)
            : null}
        </div>
        <div style={{ fontSize: "small" }}>{JSON.stringify(pyodideState)}</div>
      </div>
    </div>
  );
};

export default PyodideSlide;
