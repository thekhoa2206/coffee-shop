package com.hust.coffeeshop.models.dto.stocktaking.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateStocktakingRequest {
    private int user_id;
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    private boolean payment;
    private int status;
    private String partner;
    private String createdBy;
    private String modifiedBy;
    List<StocktakingIngredientRequest> object;
}
