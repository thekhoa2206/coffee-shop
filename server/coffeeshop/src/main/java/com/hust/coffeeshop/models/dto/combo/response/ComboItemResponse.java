package com.hust.coffeeshop.models.dto.combo.response;

import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComboItemResponse {
    private ItemRepsone item;
    private int quanntity;
}
