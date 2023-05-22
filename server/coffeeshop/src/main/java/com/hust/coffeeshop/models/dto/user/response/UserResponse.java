package com.hust.coffeeshop.models.dto.user.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
@Getter
@Setter
public class UserResponse {
    private String username;
    private String phoneNumber;
    private String name;
    private Date dob;
    private String password;
    private String email;
    private List<Integer> roleId;
}
