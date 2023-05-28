package com.hust.coffeeshop.models.dto.item.response;

import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Variant;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ItemRepsone {

    private String name;
    private String imageUrl;
    private String description;
    private String discountPercentage;
    private Object stockUnit;
    private String status;
    private Object category;
    private List<VariantRepsone> variant;
}
