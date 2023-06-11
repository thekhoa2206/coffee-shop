package com.hust.coffeeshop.models.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPrintForm {
    private int orderId;
    private String htmlContent;

    public OrderPrintForm(int orderId, String htmlContent) {
        this.htmlContent = htmlContent;
        this.orderId = orderId;
    }

}
