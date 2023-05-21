package com.hust.coffeeshop.models.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ListResponse<T> {
    private final List<T> data;

    public ListResponse(List<T> data) {
        this.data = data;
    }
}
