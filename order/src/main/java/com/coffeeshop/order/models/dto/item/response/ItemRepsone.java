package com.coffeeshop.order.models.dto.item.response;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.dto.category.CategoryResponse;
import com.coffeeshop.order.models.dto.stockunit.StockUnitResponse;
import com.coffeeshop.order.models.dto.variant.response.VariantRepsone;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ItemRepsone extends BaseResponse {
    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;
    private int status;
    private CategoryResponse category;
    private StockUnitResponse stockUnitResponse;
    private List<VariantRepsone> variants;
}
