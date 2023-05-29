package com.hust.coffeeshop.models.dto.combo.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.entity.Category;
import com.hust.coffeeshop.models.entity.Item;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ComboRespone extends BaseResponse {
    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;
    private String status;
    private Category category;
    private List<Item> items;
}
