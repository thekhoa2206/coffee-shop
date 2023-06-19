package com.hust.coffeeshop.models.dto.stocktaking.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class StocktakingIngredientRequest {
  private int  ingredientId;
  private int  quantity;
  private BigDecimal ingredientMoney;
  private int id;
}
