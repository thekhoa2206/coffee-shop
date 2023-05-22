import i18next from "i18next";
const t = i18next.getFixedT(null, ["component", "_roles"]);
export const RoleQuickFilterOptions = {
  ROLE: "role",
  ACCOUNT_ACTIVE: "account_active",
  ACCOUNT_INACTIVE: "account_inactive",
  CREATED: "created",
  MODIFIED_ON: "modifiedOn",
  NOTE: "note",
};

export const getRoleQuickFilterLabel = (key: string) => {
  switch (key) {
    case RoleQuickFilterOptions.ROLE:
      return `Vai trò`;
    case RoleQuickFilterOptions.ACCOUNT_ACTIVE:
      return `Nhân viên Đang làm việc`;
    case RoleQuickFilterOptions.ACCOUNT_INACTIVE:
      return `Nhân viên đã nghỉ việc`;
    case RoleQuickFilterOptions.CREATED:
      return `Ngày tạo`;
    case RoleQuickFilterOptions.MODIFIED_ON:
      return `Ngày cập nhật cuối`;
    case RoleQuickFilterOptions.NOTE:
      return `Ghi chú`;
    default:
      return "";
  }
};
