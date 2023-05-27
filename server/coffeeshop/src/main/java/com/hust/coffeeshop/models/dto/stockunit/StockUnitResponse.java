package com.hust.coffeeshop.models.dto.stockunit;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockUnitResponse extends BaseResponse {
    private String name;
    private int status;
}
