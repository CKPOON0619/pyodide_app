import { Package, Script } from "../pyodideContext";

export const packageHeader = "###<Package imports>###";
export const contextHeader = "###<Context variables>###";
export const scriptHeader = "###<Script>###";

export const commentHeaders = [packageHeader, contextHeader, scriptHeader];

export const addPackagesToScript = (
  packages: Array<Package>,
  script: Script
) => {
  const scriptSearchRegex = new RegExp(
    `${packageHeader}([\\n\\w\\W\\s]*)${contextHeader}`
  );
  // /###<Package imports>###([\n\w\W\s]*)###<Context variables>###/;
  const importSearch = script.match(scriptSearchRegex);
  const importScript = importSearch ? importSearch[1] : "";
  const newImports = packages.filter((pkg) => script.search(pkg) < 0);
  return script.replace(
    scriptSearchRegex,
    `###<Package imports>###${importScript}${newImports
      .map((pkg) => `import ${pkg}`)
      .join("\n")}\n###<Context variables>###`
  );
};
export const removePackagesFromScript = (pkg: string, script: string) => {
  const importRegex = new RegExp(`import ${pkg}[\\w\\s]*?\n`);
  return script.replace(importRegex, "");
};
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
