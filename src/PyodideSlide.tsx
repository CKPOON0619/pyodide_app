import * as React from "react";
import { usePyodide } from "./pyodideContext";
import { Button, Upload, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as CSV from "csv-string";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";

import "antd/dist/antd.css";
import { RcFile } from "antd/lib/upload";

const createDefaultScript = (
  imports: Array<string>,
  variables: Array<string>,
  script: string
) => {
  const importSearch = script.match(
    /###<Package imports>###\n([\n\w\W\s]*)\n###<Context/
  );
  const mainScriptSearch = script.split("###<Script>###");
  const importScript = importSearch ? importSearch[1] : "";
  const mainScriptScript =
    mainScriptSearch.length > 1 ? mainScriptSearch[1] : "";
  const newImports = imports
    .map((lib) => `import ${lib}`)
    .filter((importStatement) => script.search(importStatement) < 0);
  return `###<Package imports>###${importScript ? `\n${importScript}` : ""}${
    newImports.length > 0 ? "\n" + newImports.join("\n") : ""
  }\n###<Context variables>###${
    variables.length > 0 ? "\nfrom js import " + variables.join(", ") : ""
  }\n###<Script>###\n${mainScriptScript}`;
};
const removeImportFromScript = (pkg: string, script: string) => {
  const importRegex = new RegExp(`import ${pkg}[\\s\\w]*\n`);
  return script.replace(importRegex, "");
};
const refreshContextVarFromScript = (
  varNames: Array<string>,
  script: string
) => {
  return script.replace(
    /###<Context variables>###\n([\W\w]*)###<Script>###/,
    varNames.length > 0
      ? `###<Context variables>###\nfrom js import ${varNames.join(
          ", "
        )}\n###<Script>###`
      : "###<Context variables>###\n###<Script>###"
  );
};

const PyodideSlide: React.VoidFunctionComponent = () => {
  const { execScript, pyodideState } = usePyodide();
  const [packages, setPackages] = React.useState<Array<string>>([]);
  const [script, setScript] = React.useState<string>(
    "###<Package imports>###\n###<Context variables>###\n###<Script>###"
  );

  function onChange(newValue: string) {
    setScript(newValue);
  }

  const { Option } = Select;

  const packageOptions = ["numpy", "matplotlib", "scikit-learn"];
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
        refreshContextVarFromScript(
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
      console.log({ file, newAssets });
      console.log(
        refreshContextVarFromScript(
          newAssets.map((asset) => asset.name.split(".")[0]),
          script
        )
      );
      setAssets(newAssets);
      setScript(
        refreshContextVarFromScript(
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
      setScript(
        createDefaultScript(
          packages,
          assets.map((file: RcFile, idx) => file.name.split(".")[0]),
          script
        )
      );
    },
    [assets, script]
  );

  const handleDeselect = React.useCallback(
    (pkg: string) => {
      setScript(removeImportFromScript(pkg, script));
    },
    [script]
  );
  console.log({ script });
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
