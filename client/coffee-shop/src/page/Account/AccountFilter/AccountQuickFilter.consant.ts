import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const AccountQuickFilterOptions = {
  NAME: "name",
  PHONE_NUMBER: "phoneNumber",
  EMAIL: "email",
  CREATED: "created",
  STATUS: "status",
  ROLE: "role",
  ADDRESS: "address",
};

export const getAccountQuickFilterLabel = (key: string) => {
  switch (key) {
    case AccountQuickFilterOptions.NAME:
      return `Tên nhân viên`;
    case AccountQuickFilterOptions.PHONE_NUMBER:
      return `Số điện thoại`;
    case AccountQuickFilterOptions.EMAIL:
      return `Email`;
    case AccountQuickFilterOptions.CREATED:
      return `Ngày tạo`;
    case AccountQuickFilterOptions.STATUS:
      return `Trạng thái`;
    case AccountQuickFilterOptions.ROLE:
      return `Phân quyền`;
    case AccountQuickFilterOptions.ADDRESS:
      return `Địa chỉ`;
    default:
      return "";
  }
};

export const AccountStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  INVITE: "invite",
};

export const getAccountStatusName = (status: string) => {
  switch (status) {
    case AccountStatus.ACTIVE:
      return "Đang làm việc";
    case AccountStatus.INACTIVE:
      return "Nghỉ việc";
    case AccountStatus.INVITE:
      return "Mời";
  }
  return "";
};
