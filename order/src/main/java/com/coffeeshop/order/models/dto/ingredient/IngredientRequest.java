package com.coffeeshop.order.models.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class IngredientRequest {
    private String name;
    private int quantity;
    private BigDecimal exportPrice;
    private int stockUnitId;

}
