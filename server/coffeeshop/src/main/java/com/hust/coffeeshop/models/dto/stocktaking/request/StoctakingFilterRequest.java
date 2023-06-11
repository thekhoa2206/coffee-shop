package com.hust.coffeeshop.models.dto.stocktaking.request;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class StoctakingFilterRequest extends PagingFilterRequest {
    private String query;
    private String statuses;
    private List<Integer> ids;
    private String type;
}
