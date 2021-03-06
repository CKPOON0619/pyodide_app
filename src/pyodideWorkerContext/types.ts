export type State = "Start" | "Loading" | "Ready";

export interface PyodideState {
  state: State;
  return?: any;
}

export type Context = Object;
export type Script = string;

export interface PyodidePayLoad {
  context?: Context;
  script?: Script;
}
export interface PyodideRunScript extends PyodidePayLoad {
  onError: (error: string) => any;
  onSuccess: (data: any) => any;
}
