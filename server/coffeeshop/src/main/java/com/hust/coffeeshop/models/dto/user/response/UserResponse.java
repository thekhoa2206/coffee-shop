package com.hust.coffeeshop.models.dto.user.response;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
@Getter
@Setter
public class UserResponse  extends BaseResponse {
    private String username;
    private String phoneNumber;
    private String name;
    private String email;
    private String role;
    private int status;
    private  String passWord;
    private String scopes;
}
