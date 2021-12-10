export const packageHeader = "###<Package imports>###";
export const contextHeader = "###<Context variables>###";
export const scriptHeader = "###<Script>###";

export const commentHeaders = [packageHeader, contextHeader, scriptHeader];

export const refreshContextVarInScript = (
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
