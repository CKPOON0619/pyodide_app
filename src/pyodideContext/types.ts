export type State = "Start" | "Loading" | "Ready";

export interface PyodideState {
  state: State;
  return?: any;
}

type Package = string;
type Context = Object;
type Script = string;

export interface PyodidePayLoad {
  packages?: Package[];
  context?: Context;
  script?: Script;
}
export interface PyodideRunScript extends PyodidePayLoad {
  onError: (error: string) => any;
  onSuccess: (data: any) => any;
}
