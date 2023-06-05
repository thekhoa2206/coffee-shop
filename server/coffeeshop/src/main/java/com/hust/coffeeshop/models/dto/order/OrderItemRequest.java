package com.hust.coffeeshop.models.dto.order;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemRequest {
    private String name;
    private int productId;
    private boolean combo;
    private int quantity;
    private BigDecimal price;
}
