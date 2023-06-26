package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;
import com.hust.coffeeshop.services.InventoryService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/report/inventory")
@CrossOrigin("http://localhost:3000")
public class ReportController {
    private final InventoryService inventoryService;

    public ReportController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
    @GetMapping
    public PagingListResponse<ReportInventoryResponse> filter(ReportInventoryRequest request){
        return inventoryService.reportInventory(request);
    }
}
