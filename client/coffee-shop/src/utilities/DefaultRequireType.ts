import i18next from "i18next";
const t = i18next.getFixedT(null, "utilities");
export const DefaultRequireType = {
  SHOW_AND_NO_TRY_ON: 1,
  SHOW_AND_TRY_ON: 2,
  NO_SHOW: 3,

  getName: (status: number) => {
    switch (status) {
      case DefaultRequireType.SHOW_AND_NO_TRY_ON:
        return `${t("utilities:defaultRequireType.showAndNoTryOn")}`;
      case DefaultRequireType.SHOW_AND_TRY_ON:
        return `${t("utilities:defaultRequireType.showAndTryOn")}`;
      case DefaultRequireType.NO_SHOW:
        return `${t("utilities:defaultRequireType.noShow")}`;
      default:
        return "";
    }
  },
};
