import i18n from "i18n";

export enum CompositeFulfillmentStatus {
  DRAFT = "draft",
  WAIT_FOR_PAID = "wait_for_paid",
  WAIT_FOR_PACK = "wait_for_pack",
  WAIT_TO_PACK = "wait_to_pack",
  PACKED_PROCESSING = "packed_processing",
  WAIT_TO_PACK_CANCELLED = "wait_to_pack_cancelled",
  PACKED_PROCESSING_CANCELLED = "packed_processing_cancelled",
  PACKED = "packed",
  PACKED_CANCELLED = "packed_cancelled",
  FULFILLED = "fulfilled",
  FULFILLED_CANCELLING = "fulfilled_cancelling",
  FULFILLED_CANCELLED = "fulfilled_cancelled",
  RECEIVED = "received",
  RETRY_DELIVERY = "retry_delivery",
  PACKED_CANCELLED_CLIENT = "packed_cancelled_client",
  WAIT_FOR_COD = "wait_for_cod",
}

export const GetNameCompositeFulfillmentStatus = (status: string): string => {
  switch (status) {
    case CompositeFulfillmentStatus.DRAFT:
      return `${i18n.t(`utilities:deliveryCollationStatus.draftText`)}`;
    case CompositeFulfillmentStatus.WAIT_FOR_PAID:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitForPaidText`)}`;
    case CompositeFulfillmentStatus.WAIT_FOR_PACK:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackText`)}`;
    case CompositeFulfillmentStatus.WAIT_TO_PACK:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackText`)}`;
    case CompositeFulfillmentStatus.PACKED_PROCESSING:
      return `${i18n.t(`utilities:deliveryCollationStatus.packedProcessingText`)}`;
    case CompositeFulfillmentStatus.WAIT_TO_PACK_CANCELLED:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackCancelledText`)}`;
    case CompositeFulfillmentStatus.PACKED_PROCESSING_CANCELLED:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackCancelledText`)}`;
    case CompositeFulfillmentStatus.PACKED:
      return `${i18n.t(`utilities:deliveryCollationStatus.packedText`)}`;
    case CompositeFulfillmentStatus.PACKED_CANCELLED:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackCancelledText`)}`;
    case CompositeFulfillmentStatus.FULFILLED:
      return `${i18n.t(`utilities:deliveryCollationStatus.fulfilledText`)}`;
    case CompositeFulfillmentStatus.FULFILLED_CANCELLING:
      return `${i18n.t(`utilities:deliveryCollationStatus.fulfilledCancellingText`)}`;
    case CompositeFulfillmentStatus.FULFILLED_CANCELLED:
      return `${i18n.t(`utilities:deliveryCollationStatus.fulfilledCancelledText`)}`;
    case CompositeFulfillmentStatus.RECEIVED:
      return `${i18n.t(`utilities:deliveryCollationStatus.receivedText`)}`;
    case CompositeFulfillmentStatus.RETRY_DELIVERY:
      return `${i18n.t(`utilities:deliveryCollationStatus.retryDeliveryText`)}`;
    case CompositeFulfillmentStatus.PACKED_CANCELLED_CLIENT:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitPackCancelledText`)}`;
    case CompositeFulfillmentStatus.WAIT_FOR_COD:
      return `${i18n.t(`utilities:deliveryCollationStatus.waitForCodText`)}`;
    default:
      return "";
  }
};
