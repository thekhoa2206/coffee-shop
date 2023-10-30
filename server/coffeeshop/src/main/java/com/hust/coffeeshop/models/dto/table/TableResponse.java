package com.hust.coffeeshop.models.dto.table;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TableResponse extends BaseResponse {
    private String name;
    private int status;
}
