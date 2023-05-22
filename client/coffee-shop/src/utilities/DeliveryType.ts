import i18next from "i18next";

const t = i18next.getFixedT(null, "utilities");
export const DeliveryType = {
  COURIER: "courier",
  PICKUP: "pickup",
  getName: (type: string) => {
    switch (type) {
      case DeliveryType.COURIER:
        return t(`deliveryType.courier`);
      case DeliveryType.PICKUP:
        return t(`deliveryType.pickup`);
      default:
        return "";
    }
  },
};
