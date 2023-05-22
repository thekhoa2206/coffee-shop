import FiberManualRecordIcon from "images/order/full_circle.svg";
import FiberManualRecordOutlinedIcon from "images/order/none_circle.svg";
import PartialStatusIcon from "images/order/partial_circle.svg";
import React from "react";
import Image from "components/Image";
import { PaymentStatus } from "./PaymentStatus";
export class OrderStatusHelper {
  static renderStatusOrderIcon(status?: string) {
    switch (status) {
      case PaymentStatus.PAID:
        return <Image src={FiberManualRecordIcon} style={{ width: "12px", height: "12px" }} />;
      case PaymentStatus.UNPAID:
        return <Image src={FiberManualRecordOutlinedIcon} style={{ width: "12px", height: "12px" }} />;
      case PaymentStatus.SHOP_PAID:
        return <Image src={PartialStatusIcon} style={{ width: "12px", height: "12px" }} />;
      default:
        return <Image src={FiberManualRecordOutlinedIcon} style={{ width: "12px", height: "12px" }} />;
    }
  }
}
