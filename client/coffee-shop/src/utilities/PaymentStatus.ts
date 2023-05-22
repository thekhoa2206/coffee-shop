import i18next from "i18next";
export const PaymentStatus = {
  PAID: "paid",
  SHOP_PAID: "shop_paid",
  UNPAID: "unpaid",

  getName: (status: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return `Đã thanh toán`;
      case PaymentStatus.SHOP_PAID:
        return `Khách hàng đã trả`;
      case PaymentStatus.UNPAID:
        return `Chưa thanh toán`;
      default:
        return "";
    }
  },
};
