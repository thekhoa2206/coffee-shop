package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.exception.ErrorMessage;
import lombok.val;
import org.springframework.context.NoSuchMessageException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class BaseController {

    //Bắt exception
    @ExceptionHandler(ErrorException.class)
    @ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorMessage handleErrorException(HttpServletResponse response, ErrorException e) {
        response.setContentType("application/json");
        val exceptionMessage = new ErrorMessage();
        Map<String, Object> errors = new HashMap<String, Object>();
        for (val error : e.getMessageResult().entrySet()) {
            val key = "error";
            if (!errors.containsKey(key)) {
                try {
                    errors.put(key, error.getValue());
                } catch (NoSuchMessageException ns) {
                    val value = error.getValue();
                        errors.put(key, value);
                }
            }
        }
        exceptionMessage.setErrors(errors);
        return exceptionMessage;
    }
}
