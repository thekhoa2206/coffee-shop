package com.hust.coffeeshop.models.dto.reportOrder;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportFilterRequest extends PagingFilterRequest {
    private String createdOnMax;
    private String createdOnMin;
}
