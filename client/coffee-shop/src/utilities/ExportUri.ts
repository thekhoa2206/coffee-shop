import i18next from "i18next";
const t = i18next.getFixedT(null, "action_log");
export const ExportUri = {
  PROFIT_OTHER_EXPENSE: "/admin/reports/profit/other_expense/export",
  PROFIT_REFUND_AMOUNT: "/admin/reports/profit/refund_amount/export",
  PROFIT_VOUCHER_REVERNUE: "/admin/reports/profit/voucher_revenue/export",
  PROFIT_FREIGHT_AMOOUNT: "/admin/reports/profit/freight_amount/export",
  PROFIT_POINT_PAYMENT_AMOUNT: "/admin/reports/profit/point_payment_amount/export",
  PROFIT_TOTAL_RETURN_MAC: "/admin/reports/profit/total_return_mac/export",
  PROFIT_TOTAL_FULFILL_MAC: "/admin/reports/profit/total_fulfill_mac/export",
  PROFIT_RETURN_AMOUNT: "/admin/reports/profit/return_amount/export",
  PROFIT_DISCOUNT_COMMERCE: "/admin/reports/profit/discount_commerce/export",
  PROFIT_TOTAL_REVENUE: "/admin/reports/profit/total_revenue/export",
  SHIPMENT: "/admin/shipments/export",
  STOCK_TRANSFER: "/admin/stock_transfers/export",
  PURCHASE_ORDER: "/admin/purchase_orders/export",
  STOCK_ADJUSTMENT: "/admin/stock_adjustments/export",
  STOCK_ADJUSTMENT_V2: "/admin/stock_adjustments/v2/export",
  ORDER: "/admin/orders/export",
  ORDER_RETURN: "/admin/order_returns/export",
  FULFILLMENT: "/admin/fulfillments/export",
  CUSTOMER: "/admin/customers/export",
  SUPPLIER: "/admin/suppliers/export",
  FACT_ORDER: "/admin/reports/fact_order/by_order/export",
  DEBT_SUPPLIER: "/admin/reports/debts/suppliers/export",
  VOUCHER: "/admin/reports/vouchers/export",
  INVENTORIES_ONHAND: "/admin/reports/inventories/onhand/export",
  INVENTORIES_TRANSACTION: "/admin/reports/inventories/transaction/export",
  INVENTORIES_IEO: "/admin/reports/inventories/export_import_onhand/export",
  INVENTORIES_LOW_RATE: "/admin/reports/inventories/low_rate/export",
  INVENTORIES_HIGHT_RATE: "/admin/reports/inventories/high_rate/export",
  INVENTORIES_STOCK_ADJUSTMENT: "/admin/reports/inventories/stock_adjustments/export",
  INVENTORIES_PURCHASE_RECOMMEND: "/admin/reports/inventories/purchase_recommend/export",
  SALE_BY_DATE: "/admin/reports/sales/by_date/export",
  SALE_BY_CUSTOMER: "/admin/reports/sales/by_customer/export",
  SALE_BY_ACCOUNT: "/admin/reports/sales/by_account/export",
  SALE_BY_LOCATION: "/admin/reports/sales/by_location/export",
  SALE_BY_VARIANT: "/admin/reports/sales/by_variant/export",
  SALE_BY_END_DAY: "/admin/reports/sales/by_end_day/total/export",
  SALE_SHIPMENT_PACKAGE: "/admin/reports/sales/shipment_package/export",
  SALE_ORDER_STATISTIC: "/admin/reports/sales/order_statistic/export",
  SALE_BY_ENVOICE_DETAIL: "/admin/reports/sales/by_invoice_detail/export",
  SALE_BY_SOURCE: "/admin/reports/sales/by_source/export",
  ORDER_RETURN_BY_DATE: "/admin/reports/order_returns/by_date/export",
  SALE_VARIANTS: "/admin/reports/sales/variants/export",
  getName: (uri: string) => {
    switch (uri) {
      case ExportUri.PROFIT_OTHER_EXPENSE:
        return t(`action_log.exportUri.profitOtherExpense`);
      case ExportUri.PROFIT_REFUND_AMOUNT:
        return t(`action_log.exportUri.profitRefundAmount`);
      case ExportUri.PROFIT_VOUCHER_REVERNUE:
        return t(`action_log.exportUri.profitVoucherRevenue`);
      case ExportUri.PROFIT_FREIGHT_AMOOUNT:
        return t(`action_log.exportUri.profitFreightAmount`);
      case ExportUri.PROFIT_POINT_PAYMENT_AMOUNT:
        return t(`action_log.exportUri.pointPaymentAmount`);
      case ExportUri.PROFIT_TOTAL_RETURN_MAC:
        return t(`action_log.exportUri.totalReturnMac`);
      case ExportUri.PROFIT_TOTAL_FULFILL_MAC:
        return t(`action_log.exportUri.totalFulfillMac`);
      case ExportUri.PROFIT_RETURN_AMOUNT:
        return t(`action_log.exportUri.returnAmount`);
      case ExportUri.PROFIT_DISCOUNT_COMMERCE:
        return t(`action_log.exportUri.discountEcomerce`);
      case ExportUri.PROFIT_TOTAL_REVENUE:
        return t(`action_log.exportUri.profitTotalRevenue`);
      case ExportUri.SHIPMENT:
        return t(`action_log.exportUri.shipment`);
      case ExportUri.STOCK_TRANSFER:
        return t(`action_log.exportUri.stockTranfer`);
      case ExportUri.PURCHASE_ORDER:
        return t(`action_log.exportUri.purchaseOrder`);
      case ExportUri.STOCK_ADJUSTMENT:
        return t(`action_log.exportUri.stockAdjustment`);
      case ExportUri.STOCK_ADJUSTMENT_V2:
        return t(`action_log.exportUri.stockAdjustment`);
      case ExportUri.ORDER:
        return t(`action_log.exportUri.order`);
      case ExportUri.ORDER_RETURN:
        return t(`action_log.exportUri.orderReturn`);
      case ExportUri.FULFILLMENT:
        return t(`action_log.exportUri.fulfillment`);
      case ExportUri.CUSTOMER:
        return t(`action_log.exportUri.customer`);
      case ExportUri.SUPPLIER:
        return t(`action_log.exportUri.supplier`);
      case ExportUri.FACT_ORDER:
        return t(`action_log.exportUri.factOrder`);
      case ExportUri.DEBT_SUPPLIER:
        return t(`action_log.exportUri.debtSupplier`);
      case ExportUri.VOUCHER:
        return t(`action_log.exportUri.voucher`);
      case ExportUri.INVENTORIES_ONHAND:
        return t(`action_log.exportUri.invemntoryOnhand`);
      case ExportUri.INVENTORIES_TRANSACTION:
        return t(`action_log.exportUri.inventoryTransaction`);
      case ExportUri.INVENTORIES_IEO:
        return t(`action_log.exportUri.ieo`);
      case ExportUri.INVENTORIES_LOW_RATE:
        return t(`action_log.exportUri.lowRate`);
      case ExportUri.INVENTORIES_HIGHT_RATE:
        return t(`action_log.exportUri.hightRate`);
      case ExportUri.INVENTORIES_STOCK_ADJUSTMENT:
        return t(`action_log.exportUri.stockAdjustmentReport`);
      case ExportUri.INVENTORIES_PURCHASE_RECOMMEND:
        return t(`action_log.exportUri.purchaseRecommend`);
      case ExportUri.SALE_BY_DATE:
        return t(`action_log.exportUri.saleByDate`);
      case ExportUri.SALE_BY_CUSTOMER:
        return t(`action_log.exportUri.saleByCustomer`);
      case ExportUri.SALE_BY_ACCOUNT:
        return t(`action_log.exportUri.saleByAccount`);
      case ExportUri.SALE_BY_LOCATION:
        return t(`action_log.exportUri.saleByLocation`);
      case ExportUri.SALE_BY_VARIANT:
        return t(`action_log.exportUri.saleByVariant`);
      case ExportUri.SALE_BY_END_DAY:
        return t(`action_log.exportUri.saleByEndDay`);
      case ExportUri.SALE_SHIPMENT_PACKAGE:
        return t(`action_log.exportUri.saleShipmentPackage`);
      case ExportUri.SALE_ORDER_STATISTIC:
        return t(`action_log.exportUri.orderStatitic`);
      case ExportUri.SALE_BY_ENVOICE_DETAIL:
        return t(`action_log.exportUri.saleOrderInvoice`);
      case ExportUri.SALE_BY_SOURCE:
        return t(`action_log.exportUri.saleBySource`);
      case ExportUri.ORDER_RETURN_BY_DATE:
        return t(`action_log.exportUri.orderReturnReport`);
      case ExportUri.SALE_VARIANTS:
        return t(`action_log.exportUri.saleVariants`);
      default:
        return "";
    }
  },
};