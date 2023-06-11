package com.hust.coffeeshop.common;

import java.util.HashMap;

public class PrintVariableMap {
    public static final HashMap<String, String> ORDER = new HashMap<String, String>() {
        private static final long serialVersionUID = 1L;
        {
            put("{store_name}", "${model.storeName?default('')}");
            put("{store_address}", "${model.storeAddress}");
            put("{store_province}", "${model.storeProvince?default('')}");
            put("{store_phone_number}", "${model.storePhoneNumber?default('')}");
            put("{store_email}", "${model.storeEmail?default('')}");

            put("{order_code}", "${model.code}");
            put("{created_on}", "${model.createdOnText?datetime?string('dd-MM-yyyy')}");
            put("{modified_on}", "${model.modifiedOnText?datetime?string('dd-MM-yyyy')}");

            put("{customer_name}", "${model.customer.name}");
            put("{customer_phone_number}", "${model.customer.phone}");

            put("{line_stt}", "${line_index + 1}");
            put("{line_product_name}", "${line.name}");
            put("{line_price}", "${line.priceText}");
            put("{line_quantity}", "${line.quantityText}");
            put("{line_amount}", "${line.lineAmountText}");

            put("{total_quantity}", "${model.totalQuantityText}");
            put("{total_amount}", "${model.totalAmountText}");
            put("{total_discount}", "${model.discountTotalText}");
            put("{total_cod}", "${model.totalText}");
        }
    };

}
