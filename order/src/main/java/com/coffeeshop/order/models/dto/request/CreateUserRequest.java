package com.coffeeshop.order.models.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String username;
    private String phoneNumber;
    private String name;
    private String password;
    private String email;
    private Integer roleId;



}
