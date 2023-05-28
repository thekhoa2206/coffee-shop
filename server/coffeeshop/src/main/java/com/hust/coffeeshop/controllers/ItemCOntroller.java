package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.ItemService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/item")
@CrossOrigin("http://localhost:3000")
public class ItemCOntroller extends BaseException {
    private final ItemService itemService;

    public ItemCOntroller(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/{id}")
    public ItemRepsone getById(@PathVariable("id") int id){
        return itemService.getById(id);
    }

    @GetMapping
    public PagingListResponse<ItemRepsone> filter(ItemRequest filter){
        return itemService.filter(filter);
    }
    // tạo user mới
    @PostMapping
    public ItemRepsone create(@RequestBody CreateItemRequest request)
    {
        return itemService.create(request);
    }
    @PutMapping("/{id}")
    public ItemRepsone update(@RequestBody CreateItemRequest request, @PathVariable("id") int id){
        return itemService.update(request, id);
    }

    @DeleteMapping
    public void delete(@PathVariable("id") int id){
        itemService.delete(id);
    }
}
