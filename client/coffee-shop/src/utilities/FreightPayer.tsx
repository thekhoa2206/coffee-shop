import i18next from "i18next";

const t = i18next.getFixedT(null, "order");
export const FreightPayer = {
  SHOP: "shop",
  CUSTOMER: "customer",
  POSTMAN: "postman",
  PAY_MONTHLY: "payMonthly",
  N_T_10: "N_T_10",
  N_T_11: "N_T_11",
  N_T_20: "N_T_20",
  getName: (type?: string | null) => {
    switch (type) {
      case FreightPayer.CUSTOMER:
        return t(`order:index.drillDown.customerPaid`);
      case FreightPayer.POSTMAN:
        return "Thanh toán cho bưu tá";
      case FreightPayer.PAY_MONTHLY:
        return "Thanh toán cuối tháng";
      case FreightPayer.N_T_10:
        return "Người gửi thanh toán ngay";
      case FreightPayer.N_T_11:
        return "Người gửi thanh toán sau";
      case FreightPayer.N_T_20:
        return "Người nhận thanh toán ngay";
      default:
        return t(`order:index.drillDown.shopPaid`);
    }
  },
};
