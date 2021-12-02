import * as React from "react";
import { usePyodide } from "./pyodideContext";
import { Button } from "antd";

const PyodideSlide: React.VoidFunctionComponent = () => {
  const { execScript, state } = usePyodide();
  const script = `
    import statistics
    from js import A_rank
    statistics.stdev(A_rank)
  `;

  const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  };

  console.log("slide");
  return (
    <div>
      <Button
        onClick={() =>
          execScript({ packages: ["numpy", "pytz"], script, context })
        }
      >
        Click
      </Button>
      Pyodide Slide:{JSON.stringify(state)}
    </div>
  );
};

export default PyodideSlide;
