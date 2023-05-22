import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "Orders"]);
export const OrderQuickFilterOptions = {
  CODE: "code",
  MODIFIED_ON: "modifiedOn",
  CREATED_ON: "createdOn",
  SHIP_ON_LOCAL: "shipOnLocal",
  STATUS: "status",
  FEE: "fee",
  TOTAL: "total",
  COD: "cod",
  SHIP_STATUS: "shipStatus",
  ADDRESS: "shipStatus",
  NAME: "nameCustomer",
  PHONE: "phoneCustomer",
};

export const getOrderQuickFilterLabel = (key: string) => {
  switch (key) {
    case OrderQuickFilterOptions.CODE:
      return `Mã đơn hàng`;
    case OrderQuickFilterOptions.SHIP_ON_LOCAL:
      return `Ngày hẹn giao`;
    case OrderQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case OrderQuickFilterOptions.MODIFIED_ON:
      return `Ngày cập nhật`;
    case OrderQuickFilterOptions.STATUS:
      return `Trạng thái`;
    case OrderQuickFilterOptions.FEE:
      return `Phí`;
    case OrderQuickFilterOptions.TOTAL:
      return `Tổng tiền`;
    case OrderQuickFilterOptions.COD:
      return `Cod thu hộ`;
    case OrderQuickFilterOptions.SHIP_STATUS:
      return `Trạng thái tài xế`;
    case OrderQuickFilterOptions.ADDRESS:
      return `Địa chỉ`;
      case OrderQuickFilterOptions.NAME:
        return `Tên KH`;
      case OrderQuickFilterOptions.PHONE:
        return `SĐT Khách`;
    default:
      return "";
  }
};

export const OrderStatus = {
  //Chờ duyệt
  DRAFT: 'draft',
  //Chờ tài xế
  READY_TO_PICK: "ready_to_pick",
  //Đang lấy hàng
  PICKING: 'picking',
  //Lấy hàng k thành công
  PICKING_FAILED: 'picking_failed',
  //Đang giao hàng
  DELIVERING: 'delivering',
  //Đã hủy
  CANCEL: 'cancel',
  //Đơn hàng đã hoàn thành
  FINISH: 'finish',
  //Giao hàng thất bại
  DELIVERING_FAILED: 'delivering_failed',
  //Đang trả hàng
  RETURNING: 'returning',
  //Đã trả hàng
  RETURNED: 'returned',
};

export const getOrderStatusName = (status: string): string => {
  switch (status) {
    case OrderStatus.DRAFT:
      return 'Chờ duyệt';
    case OrderStatus.READY_TO_PICK:
      return 'Chờ tài xế';
    case OrderStatus.PICKING:
      return 'Đang lấy hàng';
    case OrderStatus.PICKING_FAILED:
      return 'Lấy hàng thất bại';
    case OrderStatus.DELIVERING:
      return 'Đang giao hàng';
    case OrderStatus.CANCEL:
      return 'Đã hủy';
    case OrderStatus.FINISH:
      return 'Hoàn thành';
    case OrderStatus.DELIVERING_FAILED:
      return 'Giao hàng thất bại';
    case OrderStatus.RETURNING:
      return 'Đang trả hàng';
    case OrderStatus.RETURNED:
      return 'Đã trả hàng';
    default:
      return "";
  }
};


export const OrderShipStatus = {
  //Đang tìm tài xế
  SEARCHING_SHIPPER: 'searching_shipper',
  //Đã có tài xế
  READY_SHIPPER: "ready_shipper",
  //Không có tài xế
  NO_SHIPPER: 'no_shipper',
};

export const getOrderShipStatusName = (status: string): string => {
  switch (status) {
    case OrderShipStatus.SEARCHING_SHIPPER:
      return 'Đang tìm tài xế';
    case OrderShipStatus.READY_SHIPPER:
      return 'Đã có tài xế';
    case OrderShipStatus.NO_SHIPPER:
      return 'Không có tài xế';
    default:
      return "";
  }
};

