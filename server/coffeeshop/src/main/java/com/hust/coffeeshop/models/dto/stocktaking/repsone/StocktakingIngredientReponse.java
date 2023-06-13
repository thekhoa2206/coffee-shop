package com.hust.coffeeshop.models.dto.stocktaking.repsone;

import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class StocktakingIngredientReponse {
    private BigDecimal ingredientMoney;
    private int  quantity;
    private IngredientResponse ingredientResponse;
    private int id;
}
