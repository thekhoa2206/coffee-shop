package com.coffeeshop.order.models.dto.combo.response;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class ComboRespone extends BaseResponse {
    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;
    private BigDecimal price;
    private String status;
    private Category category;
    private List<ComboItemResponse> items;

}
