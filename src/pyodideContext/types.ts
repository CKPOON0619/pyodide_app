export type State = "Start" | "Loading" | "Ready";

export interface PyodideState {
  state: State;
  return?: any;
}

export interface PyodidePayLoad {
  packages?: string[];
  context?: Object;
  script?: string;
}
