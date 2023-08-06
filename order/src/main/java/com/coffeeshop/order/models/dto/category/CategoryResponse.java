package com.coffeeshop.order.models.dto.category;

import com.coffeeshop.order.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse extends BaseResponse {
    private String name;
    private int status;
}
