package com.hust.coffeeshop.models.dto.stocktaking.repsone;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoctakingPrintForm {
    private int orderId;
    private String htmlContent;
}
