package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;

public interface InventoryService {
    PagingListResponse<ReportInventoryResponse> reportInventory(ReportInventoryRequest request);
}
