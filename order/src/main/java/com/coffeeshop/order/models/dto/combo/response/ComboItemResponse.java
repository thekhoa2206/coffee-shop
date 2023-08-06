package com.coffeeshop.order.models.dto.combo.response;

import com.coffeeshop.order.models.dto.item.response.ItemRepsone;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComboItemResponse {
    private ItemRepsone item;
    private int quantity;
    private int comboitemId;

}
