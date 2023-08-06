package com.coffeeshop.order.models.dto.stockunit;

import com.coffeeshop.order.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockUnitResponse extends BaseResponse {
    private String name;
    private int status;
}
