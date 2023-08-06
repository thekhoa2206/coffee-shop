package com.coffeeshop.order.models.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientCreateItemRequest {
    private int id;
    private int amountConsume;
    private int ingredientId;
    private String name;
    private int stockUnitId;
}
