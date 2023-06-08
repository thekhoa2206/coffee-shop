package com.hust.coffeeshop.models.dto.inventory.repsone;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class InventoryReponse extends BaseResponse {
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    private List<InventoryIngredientReponse> object;

}
