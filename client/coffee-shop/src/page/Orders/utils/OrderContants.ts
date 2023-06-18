export const OrderStatus = {
    DRAFT: 1,
    WAITING_DELIVERY: 2,
    COMPLETED: 3,
    DELETED: 4,
    IN_PROGRESS: 5,
    getName: (status?: number) => {
        switch (status) {
            case OrderStatus.DRAFT:
                return `Đặt hàng`;
            case OrderStatus.WAITING_DELIVERY:
                return `Đợi nhận đồ`;
            case OrderStatus.COMPLETED:
                return `Hoàn thành`;
            case OrderStatus.DELETED:
                return `Đã hủy`;
            case OrderStatus.IN_PROGRESS:
                return `Đang pha chế`;
            default:
                return "";
        }
    },
};

export const PaymentStatus = {
    UNPAID: 1,
    PAID: 2,
    getName: (status?: number) => {
        switch (status) {
            case PaymentStatus.UNPAID:
                return `Chưa thanh toán`;
            case PaymentStatus.PAID:
                return `Đã thanh toán`;
            default:
                return "Chưa thanh toán";
        }
    },
};