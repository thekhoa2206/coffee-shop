package com.hust.coffeeshop.services;


import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;

public interface ItemService {

    //api tạo
     ItemRepsone create(CreateItemRequest request);
    //api update
    ItemRepsone update(CreateItemRequest request, int id);
    //api xóa
    void delete(int id);
    //api get id
    ItemRepsone getById(int id);

    //api filter
    PagingListResponse<ItemRepsone> filter( ItemRequest filter) ;
}
