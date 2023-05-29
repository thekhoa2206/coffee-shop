package com.hust.coffeeshop.models.dto.variant.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateVariantRequest {
    private String name;
    private String status;
    private BigDecimal price;
    private  int variantId;
    private String type;

}
