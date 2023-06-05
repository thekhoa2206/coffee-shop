package com.hust.coffeeshop.models.dto.product;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductResponse extends BaseResponse {
    private String name;
    private String status;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private CategoryResponse categoryResponse;
    private String imageUrl;
    //check sản phẩm combo
    private boolean combo;
    //List variant của sản phẩm
    private List<ProductVariantResponse> variants;

    @Getter
    @Setter
    public class ProductVariantResponse extends BaseResponse{
        private String name;
        //Số lượng có thể bán;
        private int available;
        private String status;
        private BigDecimal price;
        //List nguyên liệu cấu thành lên variant
        private List<ProductIngredientResponse> ingredients;
    }

    @Getter
    @Setter
    public class ProductIngredientResponse extends BaseResponse {
        private String name;
        //Số lượng, khối lương để tạo thành variant
        private int amountConsume;
        //Số lượng, khối lượng tồn kho
        private int quantityInventory;
    }
}
