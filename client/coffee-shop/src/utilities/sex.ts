import i18next from "i18next";

const t = i18next.getFixedT(null, "utilities");

export const Sex = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  SEX: "sex",
};

export const getSex = (status: string): string => {
  switch (status) {
    case Sex.MALE:
      return t("sex.maleText");
    case Sex.FEMALE:
      return t("sex.femaleText");
    case Sex.OTHER:
      return t("sex.otherText");
    case Sex.SEX:
      return t("sex.genderText");
    default:
      return "";
  }
};
