package com.hust.coffeeshop.models.dto.report.inventory.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class IngredientOnhandResponse extends BaseResponse {
    private String name;
    private BigDecimal price;
    private BigDecimal quantityOnhand;
}
