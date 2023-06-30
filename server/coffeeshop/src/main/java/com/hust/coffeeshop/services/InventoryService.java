package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryDetailResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.StockEventsResponse;

public interface InventoryService {
    PagingListResponse<ReportInventoryResponse> reportInventory(ReportInventoryRequest request);
    ReportInventoryDetailResponse reportInventoryDetail(ReportInventoryRequest request, int id);
}
