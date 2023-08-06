package com.coffeeshop.order.models.dto.inventory.response;

import com.coffeeshop.order.models.dto.PagingListResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportInventoryDetailResponse {
    private String ingredientName;
    private PagingListResponse<StockEventsResponse> stockEvents;
}
