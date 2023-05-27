package com.hust.coffeeshop.models.dto.ingredient;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.math.BigDecimal;


@Getter
@Setter
public class IngredientResponse extends BaseResponse {
    private String name;
    private int quantity;
    private int status;
    private String stockUnitId;
    private BigDecimal exportPrice;

    private StockUnitResponse stockUnitResponse;

    @Getter
    @Setter
    public static class StockUnitResponse extends BaseResponse {
        private String name;
        private int status;
    }
}
