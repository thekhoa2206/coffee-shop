package com.hust.coffeeshop.common;

public class CommonStatus {
    public class CustomerStatus {
        public final static String ACTIVE = "active";
        public final static String DELETED = "deleted";
    }

    public class StockUnitStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }

    public class IngredientStatus {
        public final static int ACTIVE = 1;
        public final static int DELETED = 2;
    }
}
