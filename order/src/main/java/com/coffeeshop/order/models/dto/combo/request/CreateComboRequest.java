package com.coffeeshop.order.models.dto.combo.request;

import com.coffeeshop.order.models.dto.variant.request.VariantComboRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateComboRequest {
    private String name;
    private String description;
    private BigDecimal discountPercentage;
    private BigDecimal price;
    private String imageUrl;
    private List<VariantComboRequest> varianIds;
    private int categoryId;
}
