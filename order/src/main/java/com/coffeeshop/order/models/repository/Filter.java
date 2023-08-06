package com.coffeeshop.order.models.repository;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class Filter {
    private String field;
    private String fields;
    private QueryOperator operator;
    private String value;
    private List<String> values;//Used in case of IN operator
}
