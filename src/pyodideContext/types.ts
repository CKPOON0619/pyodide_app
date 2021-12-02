export type State = "Loading" | "Ready";

export interface PyodideState {
  state: State;
  return: any;
}

export interface PyodidePayLoad {
  packages?: string[];
  context?: Object;
  script?: string;
}
