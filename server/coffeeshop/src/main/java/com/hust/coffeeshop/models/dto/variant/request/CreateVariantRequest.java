package com.hust.coffeeshop.models.dto.variant.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateVariantRequest {
    private int id;
    private String name;
    private BigDecimal price;

}
