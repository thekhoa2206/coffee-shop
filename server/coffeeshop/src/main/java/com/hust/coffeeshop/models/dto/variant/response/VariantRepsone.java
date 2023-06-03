package com.hust.coffeeshop.models.dto.variant.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.dto.item.response.IngredientItemResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class VariantRepsone extends BaseResponse {
    private String name;
    private int status;
    private BigDecimal price;
    private int itemId;
    private List<IngredientItemResponse> ingredients;
}
