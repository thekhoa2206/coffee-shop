package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingReponse;
import com.hust.coffeeshop.models.dto.stocktaking.request.CreateStocktakingRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.stocktaking.request.StoctakingFilterRequest;

import javax.servlet.http.HttpServletRequest;

public interface StocktakingService {
    StocktakingReponse create(CreateStocktakingRequest request, HttpServletRequest requestHttp);
    StocktakingReponse getbyId(int id);
    PagingListResponse<StocktakingReponse> filter(StoctakingFilterRequest filter);
    StocktakingReponse update(CreateStocktakingRequest request, int id,HttpServletRequest requestHttp);
    void delete(int id);
}
