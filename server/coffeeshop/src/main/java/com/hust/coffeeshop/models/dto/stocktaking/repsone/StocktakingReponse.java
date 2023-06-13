package com.hust.coffeeshop.models.dto.stocktaking.repsone;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class StocktakingReponse extends BaseResponse {
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    private int status;
    private  String code;
    private String payment;
    private List<StocktakingIngredientReponse> object;

}
