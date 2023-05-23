package com.hust.coffeeshop.models.dto.user.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

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
