export default function (i18n, projectName, currentBranch, gitPath) {
  if (!currentBranch || currentBranch === "development") {
    currentBranch = "dev2";
  }
  if (!gitPath) {
    gitPath = "public/locales/{{lng}}/{{ns}}.json";
  }
  let i18nUpdateJs = localStorage.getItem("i18nUpdate");
  let enableI18nDetection = sessionStorage.getItem("enableDetectI18n");
  const i18nDetection = document.createElement("div");
  i18nDetection.id = "i18n-detection";
  document.getElementsByTagName("body")[0].appendChild(i18nDetection);
  document.getElementById("root").addEventListener("i18nUpdate", () => {
    if (i18nUpdateJs) {
      try {
        i18nUpdateJs = localStorage.getItem("i18nUpdate");
      } catch (e) {}
    }
  });

  sessionStorage.setItem(
    "i18n_option",
    JSON.stringify({
      loadPath: i18n.options.backend.loadPath,
      gitPath,
      ns: i18n.options.ns,
      nsSeparator: i18n.options.nsSeparator,
      keySeparator: i18n.options.keySeparator,
      contextSeparator: i18n.options.contextSeparator,
      supportedLngs: i18n.options.supportedLngs,
    })
  );
  sessionStorage.setItem("i18n-tool-project", projectName);
  sessionStorage.setItem("i18n-tool-branch", currentBranch);

  i18n["translator"]["translate_real"] = i18n["translator"]["translate"];
  const i18nKey = {};
  i18n["translator"]["translate"] = (keys, options, lastKey) => {
    const result = i18n["translator"]["translate_real"](keys, options, lastKey);
    i18nKey[keys] = result;
    if (enableI18nDetection === "true") {
      if (options && options.ns && options.ns.length === 1 && !keys.includes(i18n.options.nsSeparator)) {
        keys = options.ns + i18n.options.nsSeparator + keys;
      }
      return `(___${result}^×^${keys}___)^^^`;
    }
    return result;
  };
  return i18n;
}
