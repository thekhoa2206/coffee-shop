package com.hust.coffeeshop.services;


import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;

public interface ItemService {

    //api tạo
     ItemRepsone create(CreateItemRequest request);
    //api update
    ItemRepsone update(CreateItemRequest request, int id);
}
