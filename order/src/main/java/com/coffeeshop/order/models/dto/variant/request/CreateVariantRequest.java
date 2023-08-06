package com.coffeeshop.order.models.dto.variant.request;

import com.coffeeshop.order.models.dto.ingredient.IngredientCreateItemRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateVariantRequest {
    private int id;
    private String name;
    private BigDecimal price;
    private List<IngredientCreateItemRequest> ingredients;
}
