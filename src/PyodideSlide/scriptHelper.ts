import { Package, Script } from "../pyodideContext";

export const addPackagesToScript = (
  packages: Array<Package>,
  script: Script
) => {
  const scriptSearchRegex =
    /###<Package imports>###([\n\w\W\s]*)###<Context variables>###/;
  const importSearch = script.match(scriptSearchRegex);
  const importScript = importSearch ? importSearch[1] : "";
  const newImports = packages.filter((pkg) => script.search(pkg) < 0);
  console.log({ importSearch, importScript });
  return script.replace(
    scriptSearchRegex,
    `###<Package imports>###${importScript}${newImports
      .map((pkg) => `import ${pkg}`)
      .join("\n")}\n###<Context variables>###`
  );
};
export const removePackagesFromScript = (pkg: string, script: string) => {
  const importRegex = new RegExp(`import ${pkg}[\\s\\w]*\n`);
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

export const commentHeaders = [
  "###<Package imports>###",
  "###<Context variables>###",
  "###<Script>###",
];
