import i18n from "i18n";

const t = i18n.getFixedT(null, "customer");
export const CustomerStatus = {
  LOCKED: "locked",
  ACTIVE: "active",
  DISABLE: "disable",
  DELETED: "deleted",
  ALL: "all",
  getName: (status: string) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return t(`customer:customerStatus.active`);
      case CustomerStatus.DISABLE:
        return t(`customer:customerStatus.disable`);
      case CustomerStatus.DELETED:
        return t(`customer:customerStatus.delete`);
      default:
        return "";
    }
  },
};
export const CustomerGroupStatus = {
  ACTIVE: "active",
  DELETED: "deleted",
  getName: (status: string) => {
    switch (status) {
      case CustomerGroupStatus.ACTIVE:
        return t(`customer:customerStatus.active`);
      case CustomerGroupStatus.DELETED:
        return t(`customer:customerStatus.delete`);
      default:
        return "";
    }
  },
};
