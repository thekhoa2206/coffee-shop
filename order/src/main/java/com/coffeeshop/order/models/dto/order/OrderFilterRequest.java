package com.coffeeshop.order.models.dto.order;

import com.coffeeshop.order.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class OrderFilterRequest extends PagingFilterRequest {
    private List<Integer> ids;
    private String query;
    private String statuses;
    private String paymentStatus;
    private String createdOnMax;
    private String createdOnMin;
    private String modifiedOnMax;
    private String modifiedOnMin;
}
