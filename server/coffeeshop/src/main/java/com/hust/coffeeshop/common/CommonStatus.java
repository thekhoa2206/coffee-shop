package com.hust.coffeeshop.common;

public class CommonStatus {
    public class CustomerStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }

    public class StockUnitStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }
    public class StockingStatus {
        //đặt hàng
        public final static int ORDER =1;
        //nhập kho
        public final static int WAREHOUSE =2;
        public final static int DELETED = 3;
    }

    public class StockingPayment {
        //chưa than toán
        public final static int UNPAID = 1;
        // đã thanh toán
        public final static int ACTIVE = 2;
    }
    public class IngredientStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }

    public class VariantStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }

    public class ItemIngredientStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }
    public class OrderStatus {
        //Đặt hàng
        public final static int DRAFT = 1;
        //Đang chờ lấy đồ
        public final static int WAITING_DELIVERY = 2;
        //Đã hoàn thành
        public final static int COMPLETED = 3;
        public final static int DELETED = 4;
    }
    public class PaymentStatus {
        public final static int UNPAID = 1;
        public final static int PAID = 2;
    }
    public class OrderItemStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }
}
