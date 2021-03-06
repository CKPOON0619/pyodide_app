import * as React from "react";
import { usePyodideWorker } from "../pyodideWorkerContext";
import { Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { refreshContextVarInScript, commentHeaders } from "./scriptHelper";
import * as CSV from "csv-string";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";

import "antd/dist/antd.css";
import { RcFile } from "antd/lib/upload";

const PyodideWorkerSlide: React.VoidFunctionComponent = () => {
  const { execScript, pyodideState, restart } = usePyodideWorker();
  const [script, setScript] = React.useState<string>(commentHeaders.join("\n"));

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
    execScript({ script, context });
  }, [execScript, script, assets]);

  const handleRestart = React.useCallback(() => {
    restart();
  }, [restart]);
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
          <Button onClick={handleRestart}>Restart Pyodide</Button>
          <Button onClick={handleScriptExecute}>Execute Script</Button>
        </div>
        <div style={{ fontSize: "small" }}>
          {pyodideState.return && pyodideState.return.error}
        </div>
        <div style={{ fontSize: "small" }}>{JSON.stringify(pyodideState)}</div>
      </div>
    </div>
  );
};

export default PyodideWorkerSlide;
