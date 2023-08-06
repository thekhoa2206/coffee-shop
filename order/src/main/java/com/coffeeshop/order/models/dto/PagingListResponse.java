package com.coffeeshop.order.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class PagingListResponse<T> extends ListResponse<T> {
    private final Metadata metadata;

    public PagingListResponse(List<T> data, Metadata metadata) {
        super(data);
        this.metadata = metadata;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Metadata {
        private final int page;
        private final int limit;
        private final long total;
    }

}
