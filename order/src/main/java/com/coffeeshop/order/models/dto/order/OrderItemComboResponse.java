package com.coffeeshop.order.models.dto.order;

import com.coffeeshop.order.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemComboResponse extends BaseResponse {
    private String name;
    private int status;
    private int orderId;
    private int orderItemId;
    private BigDecimal price;
    private int quantity;
    private int comboItemId;
    private int variantId;
}
