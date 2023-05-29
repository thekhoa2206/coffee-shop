package com.hust.coffeeshop.models.dto.category;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse extends BaseResponse {
    private String name;
    private String status;
}
