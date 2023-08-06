package com.coffeeshop.order.models.dto.ingredient;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.dto.stockunit.StockUnitResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class IngredientResponse extends BaseResponse {
    private String name;
    private int quantity;
    private int status;
    private String stockUnitId;
    private BigDecimal exportPrice;
    private StockUnitResponse stockUnitResponse;
}
