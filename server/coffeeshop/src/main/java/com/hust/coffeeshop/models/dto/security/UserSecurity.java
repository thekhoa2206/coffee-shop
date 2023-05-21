package com.hust.coffeeshop.models.dto.security;

import com.hust.coffeeshop.models.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class UserSecurity {
    private String username;
    private int id;
    private String name;
    private String password;
    private List<Role> roles;
}
