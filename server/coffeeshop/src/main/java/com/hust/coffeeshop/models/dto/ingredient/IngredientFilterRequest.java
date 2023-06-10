package com.hust.coffeeshop.models.dto.ingredient;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IngredientFilterRequest extends PagingFilterRequest {
    private List<Integer> ids;
    private String query;
    private String statuses;
    private List<Integer> variantIds;
}
