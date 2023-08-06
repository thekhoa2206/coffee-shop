package com.coffeeshop.order.models.exception;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

import java.util.Map;

@Data
@JsonRootName("data_error")
@JsonTypeName("data_error")
public class ErrorMessage {
    private Map<String, Object> errors;
}
