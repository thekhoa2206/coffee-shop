package com.hust.coffeeshop.models.dto.item.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IngredientItemResponse extends BaseResponse {
    private int amountConsume;
    private int ingredientId;
    private String name;
}
