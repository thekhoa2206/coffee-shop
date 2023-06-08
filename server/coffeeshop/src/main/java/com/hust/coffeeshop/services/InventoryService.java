package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.inventory.repsone.InventoryReponse;
import com.hust.coffeeshop.models.dto.inventory.request.CreateinventoryRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.entity.User;

import javax.servlet.http.HttpServletRequest;

public interface InventoryService {
    InventoryReponse create(CreateinventoryRequest request, HttpServletRequest requestHttp);
    InventoryReponse getbyId( int id);
    PagingListResponse<InventoryReponse> filter(ItemRequest filter);
}
