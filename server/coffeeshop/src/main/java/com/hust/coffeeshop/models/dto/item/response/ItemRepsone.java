package com.hust.coffeeshop.models.dto.item.response;

import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Variant;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ItemRepsone {

    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;

    private String status;
    private Object category;
    private StockUnitResponse stockUnitResponse;
    private List<VariantRepsone> variant;
    private List<IngredientResponse> ingredient;
}
