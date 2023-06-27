package com.hust.coffeeshop.models.dto.report.inventory.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;
import com.hust.coffeeshop.models.dto.PagingListResponse;

import java.util.List;

@Getter
@Setter
public class ReportInventoryDetailResponse {
    private String ingredientName;
    private PagingListResponse<StockEventsResponse> stockEvents;
}
