package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.repository.InventoryRepository;
import com.hust.coffeeshop.services.InventoryService;
import org.springframework.stereotype.Service;

@Service
public class InventoryServiceImpl implements InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

}
