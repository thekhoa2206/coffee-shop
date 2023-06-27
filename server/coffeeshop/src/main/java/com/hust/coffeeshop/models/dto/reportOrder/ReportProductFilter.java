package com.hust.coffeeshop.models.dto.reportOrder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportProductFilter extends ReportFilterRequest {
    //Số lượng top sản phẩm (ví dụ top 10, 4, 5... sp)
    private int top;
}
