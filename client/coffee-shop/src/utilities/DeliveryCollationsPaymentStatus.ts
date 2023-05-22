import i18next from "i18next";
const t = i18next.getFixedT(null, "utilities");
export const DeliveryCollationsPaymentStatus = {
  UNPAID: "unpaid",
  PAID: "paid",
  PARTIAL: "partial",

  getName: (status: string) => {
    switch (status) {
      case DeliveryCollationsPaymentStatus.UNPAID:
        return `${t("utilities:deliveryCollationsPaymentStatus.unpaid")}`;
      case DeliveryCollationsPaymentStatus.PAID:
        return `${t("utilities:deliveryCollationsPaymentStatus.paid")}`;
      case DeliveryCollationsPaymentStatus.PARTIAL:
        return `${t("utilities:deliveryCollationsPaymentStatus.partial")}`;
      default:
        return "";
    }
  },
};
