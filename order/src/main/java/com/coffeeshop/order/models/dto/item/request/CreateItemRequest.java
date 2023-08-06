package com.coffeeshop.order.models.dto.item.request;

import com.coffeeshop.order.models.dto.variant.request.CreateVariantRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class CreateItemRequest {
    private String name;
    private String imageUrl;
    private String description;
    private BigDecimal discountPercentage;
    private int stockUnitId;
    private int categoryId;
    private List<CreateVariantRequest> variantRequest;
}
