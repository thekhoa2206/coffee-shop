package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.FilterinventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryDetailResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.StockEventsResponse;
import com.hust.coffeeshop.services.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping(value = "/api/report/inventory")
@CrossOrigin("http://localhost:3000")
public class ReportInventoryController {
    private final InventoryService inventoryService;

    public ReportInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
    @GetMapping
    public PagingListResponse<ReportInventoryResponse> filter(FilterinventoryRequest request) throws ParseException {
        ReportInventoryRequest requests = new ReportInventoryRequest();
        if(request.getEndDate() != null && request.getStartDate() != null){
       Long startDate= CommonCode.getMilliSeconds(request.getStartDate(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
       Long endtDate= CommonCode.getMilliSeconds(request.getEndDate(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
       requests.setEndDate(endtDate+86400000);
        requests.setStartDate(startDate);
        }else {
            requests.setEndDate(0);
            requests.setStartDate(0);
        }
        return inventoryService.reportInventory(requests);
    }
    @GetMapping(value = "/{id}")
    public ReportInventoryDetailResponse Detail(@PathVariable("id") int id, FilterinventoryRequest request) throws ParseException {
        ReportInventoryRequest requests = new ReportInventoryRequest();
        if(request.getEndDate() != null && request.getStartDate() != null){
            Long startDate= CommonCode.getMilliSeconds(request.getStartDate(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
            Long endtDate= CommonCode.getMilliSeconds(request.getEndDate(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
            requests.setEndDate(endtDate+86400000);
            requests.setStartDate(startDate);
        }else {
            requests.setEndDate(0);
            requests.setStartDate(0);
        }
        return inventoryService.reportInventoryDetail(requests,id);
    }
}
