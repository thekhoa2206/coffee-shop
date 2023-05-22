import i18n from "i18n";

const t = i18n.getFixedT(null, "utilities");
export const DiscountType = {
  PERCENT: "PERCENT",
  VALUE: "VALUE",
  getName: (type: string): string => {
    switch (type) {
      case DiscountType.PERCENT:
        return "%";
      case DiscountType.VALUE:
        return t(`discountType.percent`);
      default:
        return "";
    }
  },
};

export const PurchaseDiscountType = {
  PERCENT: "percent",
  FIX_AMOUNT: "value",
  getName: (type: string): string => {
    switch (type) {
      case PurchaseDiscountType.PERCENT:
        return "%";
      case PurchaseDiscountType.FIX_AMOUNT:
        return t(`utilities:purchaseDiscountType.fixAmount`);
      default:
        return "";
    }
  },
};
