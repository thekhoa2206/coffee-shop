package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.exception.ErrorMessage;
import com.hust.coffeeshop.models.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.val;
import org.springframework.context.NoSuchMessageException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class BaseController {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public BaseController(UserRepository userRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

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

    public User getUserByJwt(String jwt) {
        if (jwt == null) throw new ErrorException("Jwt không được để trống!");
        var username = jwtProvider.getUserNameFromJwtToken(jwt);
        if (username == null) throw new ErrorException("Tài khoản không có thông tin!");
        var user = userRepository.findUserByUsername(username);
        if (user == null) throw new ErrorException("Người dùng không có thông tin!");
        return user;
    }
}
