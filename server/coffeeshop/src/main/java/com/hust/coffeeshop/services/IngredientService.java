package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.entity.Ingredient;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IngredientService {
    //api tạo
    IngredientResponse create(IngredientRequest request);

    //api update
    IngredientResponse update(IngredientRequest request, int id);

    //api xóa
    void delete(int id);

    //api get id
    IngredientResponse getById(int id);

    //api filter
    PagingListResponse<IngredientResponse> filter(IngredientFilterRequest filter) ;

    Page<Ingredient> filterIngredient(IngredientFilterRequest filter);
}
