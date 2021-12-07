import * as React from "react";
import { usePyodide } from "../pyodideContext";
import { Button, Upload, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  refreshContextVarInScript,
  addPackagesToScript,
  removePackagesFromScript,
  commentHeaders,
} from "./scriptHelper";
import * as CSV from "csv-string";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";

import "antd/dist/antd.css";
import { RcFile } from "antd/lib/upload";

const PyodideSlide: React.VoidFunctionComponent = () => {
  const { execScript, pyodideState } = usePyodide();
  const [packages, setPackages] = React.useState<Array<string>>([]);
  const [script, setScript] = React.useState<string>(commentHeaders.join("\n"));

  function onChange(newValue: string) {
    setScript(newValue);
  }

  const { Option } = Select;

  const packageOptions = ["numpy", "pandas"];
  const selectOptions: Array<React.ReactNode> = [];
  for (let i = 0; i < packageOptions.length; i++) {
    selectOptions.push(
      <Option value={packageOptions[i]} key={packageOptions[i]}>
        {packageOptions[i]}
      </Option>
    );
  }
  const [assets, setAssets] = React.useState<Array<RcFile>>([]);
  const handleFileLoad = React.useCallback(
    (file) => {
      setAssets([...assets, file]);
      console.log([...assets, file].map((asset) => asset.name.split(".")[0]));
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
    execScript({ packages, script, context });
  }, [execScript, packages, script, assets]);

  const handlePackageAdd = React.useCallback(
    (packages) => {
      setPackages(packages);
      setScript(addPackagesToScript(packages, script));
    },
    [assets, script]
  );

  const handleDeselect = React.useCallback(
    (pkg: string) => {
      setScript(removePackagesFromScript(pkg, script));
    },
    [script]
  );
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
        <Form.Item label="Packages">
          <Select
            mode="tags"
            size="small"
            placeholder="Select Packages"
            defaultValue={[]}
            onDeselect={handleDeselect}
            onChange={handlePackageAdd}
            style={{ width: "100%" }}
          >
            {selectOptions}
          </Select>
        </Form.Item>
      </div>
      <div>
        <AceEditor
          mode="python"
          theme="ambiance"
          onChange={onChange}
          value={script}
          editorProps={{ $blockScrolling: true }}
        />
        <Button onClick={handleScriptExecute}>Execute Script</Button>
        <div> {pyodideState.return && pyodideState.return.error}</div>
        <div>{JSON.stringify(pyodideState)}</div>
      </div>
    </div>
  );
};

export default PyodideSlide;
