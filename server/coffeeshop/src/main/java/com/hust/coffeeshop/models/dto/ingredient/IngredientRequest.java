package com.hust.coffeeshop.models.dto.ingredient;

import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
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
