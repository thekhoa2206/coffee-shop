package com.hust.coffeeshop.models.dto.product;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@Data
@AllArgsConstructor
public class ProductResponse extends BaseResponse {
    private String name;
    private int status;
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
    public static class ProductVariantResponse extends BaseResponse {
        private String name;
        //Số lượng có thể bán;
        private int available;
        private int status;
        //giá của variant
        private BigDecimal price;
        //List nguyên liệu cấu thành lên variant
        private List<ProductIngredientResponse> ingredients;
        //id thành phần(với combo là combo_item_id )
        private int productItemId;
    }

    @Getter
    @Setter
    public static class ProductIngredientResponse extends BaseResponse {
        private String name;
        //Số lượng, khối lương để tạo thành variant
        private int amountConsume;
        //Số lượng, khối lượng tồn kho
        private int quantityInventory;
        private int status;
        private int ingredientId;
    }
}
