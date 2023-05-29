package com.hust.coffeeshop.models.dto.item.request;

import com.hust.coffeeshop.models.dto.variant.request.CreateVariantRequest;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.util.List;

@Setter
@Getter
public class CreateItemRequest {
    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;
    private int stockUnitId;
    private String status;
    private int categoryId;
    private List<CreateVariantRequest> variantRequest;
}