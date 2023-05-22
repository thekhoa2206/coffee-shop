import i18next from "i18next";
const t = i18next.getFixedT(null, "utilities");
export const Warranty = {
  YES: true,
  NO: false,
  getName: (value: boolean) => {
    switch (value) {
      case Warranty.YES:
        return `${t("utilities:warranty.yes")}`;
      case Warranty.NO:
        return `${t("utilities:warranty.no")}`;
      default:
        return "";
    }
  },
  getExactName: (value: boolean) => {
    switch (value) {
      case Warranty.YES:
        return `${t("utilities:warranty.applyName")}`;
      case Warranty.NO:
        return `${t("utilities:warranty.notApplyName")}`;
      default:
        return "";
    }
  },
};
