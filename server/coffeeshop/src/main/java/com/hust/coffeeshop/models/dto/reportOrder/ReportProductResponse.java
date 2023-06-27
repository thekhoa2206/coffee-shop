package com.hust.coffeeshop.models.dto.reportOrder;

import com.hust.coffeeshop.models.dto.product.ProductResponse;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReportProductResponse {
    private VariantRepsone variant;
    //tổng số lượng đã bán
    private int totalQuantity;
    // tổng doanh thu
    private BigDecimal totalRevenue;
}
