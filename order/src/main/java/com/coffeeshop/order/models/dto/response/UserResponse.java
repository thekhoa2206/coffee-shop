package com.coffeeshop.order.models.dto.response;

import com.coffeeshop.order.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

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
