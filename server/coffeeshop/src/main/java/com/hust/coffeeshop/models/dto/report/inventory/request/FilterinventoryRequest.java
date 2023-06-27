package com.hust.coffeeshop.models.dto.report.inventory.request;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilterinventoryRequest extends PagingFilterRequest {
    private String startDate;
    private String endDate;
}
