package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;

public interface StockUnitService {
    //api tạo
    StockUnitResponse create(StockUnitRequest request);

    //api update
    StockUnitResponse update(StockUnitRequest request, int id);

    //api xóa
    void delete(int id);

    //api get id
    StockUnitResponse getById(int id);

    //api filter
    PagingListResponse<StockUnitResponse> filter(StockUnitFilterRequest filter) ;
}
