package com.hust.coffeeshop.models.exception;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class ErrorException extends BaseException{
    protected Map<String, Object> messageResult;

    public ErrorException(Object message) {
        messageResult = new HashMap<String, Object>();
        messageResult.put("error", message);
    }
}
