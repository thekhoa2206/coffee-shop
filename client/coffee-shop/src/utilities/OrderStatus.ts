export const OrderStatus = {
    //Chờ duyệt
    DRAFT: 'draft',
    //Chờ lấy hàng
    READY_TO_PICK: "ready_to_pick",
    //Đang lấy hàng
    PICKING: 'picking',
    //Lấy hàng k thành công
    PICKING_FAILED: 'picking_failed',
    //Lưu kho
    STORING: 'storing',
    //Đang giao hàng
    DELIVERING: 'delivering',
    //Đã hủy
    CANCEL: 'cancel',
    //Hàng đã bị mất
    LOST_ORDER: 'lost_order',
    //Đơn hàng đã hoàn thành
    FINISH: 'finish',
    //Giao hàng thất bại
    DELIVERING_FAILED: 'delivering_failed',
    //Đơn hàng đang trả lại
    RETURN: 'return',
    //Đã trả hàng
    RETURNED: 'returned'
  };

  export const getOrderStatusName = (status: string): string => {
    switch (status) {
        case OrderStatus.DRAFT:
            return 'Chờ duyệt';
        case OrderStatus.READY_TO_PICK:
            return 'Chờ lấy hàng';
        case OrderStatus.PICKING:
            return 'Đang lấy hàng';
        case OrderStatus.PICKING_FAILED:
            return 'Lấy hàng k thành công';
        case OrderStatus.STORING:
            return 'Lưu kho';
        case OrderStatus.DELIVERING:
            return 'Đang giao hàng';
        case OrderStatus.CANCEL:
            return 'Đã hủy';
        case OrderStatus.LOST_ORDER:
            return 'Hàng đã bị mất';
        case OrderStatus.FINISH:
            return 'Hoàn thành';
        case OrderStatus.DELIVERING_FAILED:
            return 'Giao hàng thất bại';
        case OrderStatus.RETURN:
            return 'Đơn hàng đang trả lại';
        case OrderStatus.RETURNED:
            return 'Đã trả hàng';
      default:
        return "";
    }
  };
  