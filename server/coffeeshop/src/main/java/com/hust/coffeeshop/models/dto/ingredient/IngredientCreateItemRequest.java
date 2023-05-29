package com.hust.coffeeshop.models.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class IngredientCreateItemRequest {
    private int id;
    private int amountConsume;
    private String type;
}
