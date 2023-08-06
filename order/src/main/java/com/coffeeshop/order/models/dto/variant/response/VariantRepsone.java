package com.coffeeshop.order.models.dto.variant.response;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.dto.item.response.IngredientItemResponse;
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
    private int available;
}
