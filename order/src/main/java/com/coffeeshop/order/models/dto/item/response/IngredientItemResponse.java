package com.coffeeshop.order.models.dto.item.response;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.dto.stockunit.StockUnitResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientItemResponse extends BaseResponse {
    private int amountConsume;
    private int ingredientId;
    private String name;
    private StockUnitResponse stockUnitResponse;
}
