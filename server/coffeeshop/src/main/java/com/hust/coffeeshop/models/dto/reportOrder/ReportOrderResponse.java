package com.hust.coffeeshop.models.dto.reportOrder;

import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ReportOrderResponse {
    private BigDecimal quantityOrder;
    private BigDecimal quantityOrderCancel;
    private BigDecimal totalOrder;
    private BigDecimal totalOrderCancel;
    // Tổng tiền nguyên liệu đã dùng
    private BigDecimal totalIngredient;
    // Tổng tiền nguyên liệu bị huỷ
    private BigDecimal totalIngredientCancel;
}
