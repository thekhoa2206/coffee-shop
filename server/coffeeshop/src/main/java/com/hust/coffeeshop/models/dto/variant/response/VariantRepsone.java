package com.hust.coffeeshop.models.dto.variant.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class VariantRepsone {
    private String name;
    private String status;
    private BigDecimal price;
    private  int itemId;
}
