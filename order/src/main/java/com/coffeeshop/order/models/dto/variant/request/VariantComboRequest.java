package com.coffeeshop.order.models.dto.variant.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VariantComboRequest {
    private  int variantId;
    private  int quantity;
    private  int comboitemId;
}
