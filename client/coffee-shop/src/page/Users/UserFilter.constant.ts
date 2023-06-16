import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const UserQuickFilterOptions = {
  CODE:"code",
  NAME: "name",
  USERNAME:"userName",
  PHONE:"phone",
  STATUS: "status",
  CREATED_ON: "createdOn",
  MODIFIED_ON: "modifieldOn",

};

export const getUserQuickFilterLabel = (key: string) => {
  switch (key) {
    case UserQuickFilterOptions.CODE:
      return `Mã nhân viên`;
    case UserQuickFilterOptions.NAME:
      return `Tên nhân viên`;
    case UserQuickFilterOptions.STATUS:
      return `Trạng thái`;
       case UserQuickFilterOptions.PHONE:
      return `Số điện thoại`;
    case UserQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case UserQuickFilterOptions.MODIFIED_ON:
      return `Ngày sửa`;
    default:
      return "";
  }
};
