package com.hust.coffeeshop.models.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IngredientFilterRequest {
    private List<Integer> ids;
    private String query;
    private String statuses;
}
