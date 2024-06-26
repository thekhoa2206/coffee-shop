package com.hust.coffeeshop.models.dto.variant;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class VariantFilterRequest extends PagingFilterRequest {
    private List<Integer> ids;
    private String query;
    private String statuses;
    private List<Integer> comboIds;
}