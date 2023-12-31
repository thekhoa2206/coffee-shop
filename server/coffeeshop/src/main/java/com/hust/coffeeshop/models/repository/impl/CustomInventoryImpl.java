package com.hust.coffeeshop.models.repository.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.entity.InventoryLog;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomInventoryImpl {
    private final NamedParameterJdbcTemplate jdbcTemplate;

    public CustomInventoryImpl(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

}
