package com.hust.coffeeshop.models.dto.report.inventory.response;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReportInventoryOnhand {
    private PagingListResponse<IngredientOnhandResponse> inventories;
}
