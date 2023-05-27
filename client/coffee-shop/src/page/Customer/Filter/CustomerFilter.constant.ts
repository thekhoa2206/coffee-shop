import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const CustomerQuickFilterOptions = {
  CODE: "code",
  NAME: "name",
  PHONE_NUMBER: "phoneNumber",
  CREATED_ON: "createdOn",
  MODIFIED_ON: "modifieldOn",
  SEX: "sex",
};

export const getCustomerQuickFilterLabel = (key: string) => {
  switch (key) {
    case CustomerQuickFilterOptions.CODE:
      return `Mã KH`;
    case CustomerQuickFilterOptions.NAME:
      return `Tên KH`;
    case CustomerQuickFilterOptions.PHONE_NUMBER:
      return `Số điện thoại`;
    case CustomerQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case CustomerQuickFilterOptions.MODIFIED_ON:
        return `Ngày sửa`;
    case CustomerQuickFilterOptions.SEX:
      return `Giới tính`;
    default:
      return "";
  }
};
