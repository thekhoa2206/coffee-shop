package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.inventory.request.CreateinventoryRequest;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.entity.Inventory;
import com.hust.coffeeshop.services.InventoryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/ingredient")
@CrossOrigin("http://localhost:3000")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // tạo user mới
    @PostMapping
    public Inventory create(@RequestBody CreateinventoryRequest request)
    {
        return ;
    }
}
