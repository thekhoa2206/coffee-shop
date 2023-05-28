package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
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

    // tạo user mới
    @PostMapping
    public ItemRepsone create(@RequestBody CreateItemRequest request)
    {
        return itemService.create(request);
    }
}
