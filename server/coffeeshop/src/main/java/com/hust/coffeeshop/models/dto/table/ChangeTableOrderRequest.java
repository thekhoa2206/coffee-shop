package com.hust.coffeeshop.models.dto.table;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChangeTableOrderRequest {
    private List<Integer> tableOlds;
    private List<Integer> tableNews;
}
