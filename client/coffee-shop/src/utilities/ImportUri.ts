import i18next from "i18next";

const t = i18next.getFixedT(null, "action_log");
export const ImportUri = {
  PRICE_ADJUSTMENT: "/admin/price_adjustments/import",
  STOCK_TRANSFER: "/admin/stock_transfers/import",
  CUSTOMER: "/admin/customers/import",
  SUPPLIER: "/admin/suppliers/import",
  PRODUCT: "/admin/products/import",
  STOCK_ADJUSTMENT: "/admin/stock_adjustments/import",
  STOCK_ADJUSTMENT_V2: "/admin/stock_adjustments/v2/import",
  PURCHASE_ORDER: "/admin/purchase_orders/import",
  DELIVERY_COLLATION: "/admin/delivery_collations/import",
  LOYALTY_ADJUSTMENTS: "/admin/loyalty_adjustments/import",
  COUPON_CODE: "/coupon_codes/import",
  SHIPMENT_HANDOVER: "/shipment_handovers/import",

  getName: (uri: string) => {
    switch (uri) {
      case ImportUri.PRICE_ADJUSTMENT:
        return t(`action_log.importUri.priceAdjustment`);
      case ImportUri.STOCK_TRANSFER:
        return t(`action_log.importUri.stockTransfer`);
      case ImportUri.CUSTOMER:
        return t(`action_log.importUri.customer`);
      case ImportUri.SUPPLIER:
        return t(`action_log.importUri.supplier`);
      case ImportUri.PRODUCT:
        return t(`action_log.importUri.product`);
      case ImportUri.STOCK_ADJUSTMENT:
      case ImportUri.STOCK_ADJUSTMENT_V2:
        return t(`action_log.importUri.stockAdjustment`);
      case ImportUri.PURCHASE_ORDER:
        return t(`action_log.importUri.purchaseOrder`);
      case ImportUri.DELIVERY_COLLATION:
        return t(`action_log.importUri.deliveryCollation`);
      case ImportUri.LOYALTY_ADJUSTMENTS:
        return t(`action_log.importUri.loyaltyAdjustment`);
      case ImportUri.SHIPMENT_HANDOVER:
        return t(`action_log.importUri.shipmentHandover`);
      default:
        if (uri.includes(ImportUri.COUPON_CODE)) {
          return t(`action_log.importUri.couponCode`);
        } else return "";
    }
  },
};
