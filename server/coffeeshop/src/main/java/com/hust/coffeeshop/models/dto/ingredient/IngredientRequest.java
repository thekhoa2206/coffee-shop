package com.hust.coffeeshop.models.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class IngredientRequest {
    private String name;
    private int quantity;
    private BigDecimal exportPrice;

    private StockUnitRequest stockUnit;

    @Getter
    @Setter
    public static class StockUnitRequest {
        private String name;
    }
}
