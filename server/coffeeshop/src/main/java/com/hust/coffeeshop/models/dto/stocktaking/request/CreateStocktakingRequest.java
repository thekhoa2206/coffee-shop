package com.hust.coffeeshop.models.dto.stocktaking.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateStocktakingRequest {
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    private boolean payment;
    private int status;
    List<StocktakingIngredientRequest> object;
}
