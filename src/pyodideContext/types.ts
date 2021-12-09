export type State = "Start" | "Loading" | "Ready" | "Error";

export type PyodideInstance = any; // TODO: To be typed
export interface PyodideState {
  state: State;
  return?: any;
}

export type Context = Record<string, any>;
export type Script = string;

export interface PyodideRunScriptPayload {
  context?: Context;
  script: Script;
}
export interface PyodideContextValue {
  runScript: (payload: PyodideRunScriptPayload) => void;
  pyodideInstance: PyodideInstance;
  state?: PyodideState;
}
