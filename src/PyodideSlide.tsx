import * as React from "react";
import { usePyodide } from "./pyodideContext";
import { Button, Select, Form } from "antd";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";

import "antd/dist/antd.css";

const PyodideSlide: React.VoidFunctionComponent = () => {
  const { execScript, pyodideState } = usePyodide();
  const [packages, setPackages] = React.useState<Array<string>>([]);
  const [script, setScript] = React.useState<string>(`
import statistics
from js import A_rank
statistics.stdev(A_rank)
    `);

  const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  };
  function onChange(newValue: string) {
    setScript(newValue);
  }

  const { Option } = Select;

  console.log("slide");
  const packageOptions = ["numpy", "matplotlib", "scikit"];
  const selectOptions: Array<React.ReactNode> = [];
  for (let i = 0; i < packageOptions.length; i++) {
    selectOptions.push(
      <Option value={packageOptions[i]} key={packageOptions[i]}>
        {packageOptions[i]}
      </Option>
    );
  }
  console.log({ selectOptions });
  return (
    <div>
      <div>
        <Form.Item label="Packages">
          <Select
            mode="tags"
            size="small"
            placeholder="Please select"
            defaultValue={["numpy"]}
            onChange={console.log}
            style={{ width: "100%" }}
          >
            {selectOptions}
          </Select>
        </Form.Item>
      </div>
      <div>
        <AceEditor
          mode="python"
          theme="github"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          value={script}
          editorProps={{ $blockScrolling: true }}
        />
        <Button
          onClick={() => execScript({ packages: packages, script, context })}
        >
          Execute Script
        </Button>
        <div> {JSON.stringify(pyodideState)}</div>
      </div>
    </div>
  );
};

export default PyodideSlide;
