package com.hust.coffeeshop.models.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryVariant {
    //variant Id
    private int variantId;

    //số lượng cộng hoặc trừ kho
    private int quantity;
}
