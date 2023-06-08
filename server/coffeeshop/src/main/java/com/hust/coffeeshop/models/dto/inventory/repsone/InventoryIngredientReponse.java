package com.hust.coffeeshop.models.dto.inventory.repsone;

import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class InventoryIngredientReponse {
    private BigDecimal ingredientMoney;
    private int  quantity;
    private IngredientResponse ingredientResponse;
}
