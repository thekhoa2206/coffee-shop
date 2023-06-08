package com.hust.coffeeshop.models.dto.inventory.request;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateinventoryRequest {
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    List<InventoryIngredientRequest> object;
}
