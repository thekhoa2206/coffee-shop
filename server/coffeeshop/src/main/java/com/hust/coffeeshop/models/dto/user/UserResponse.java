package com.hust.coffeeshop.models.dto.user;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class UserResponse extends BaseResponse {
    private String name;
    private String username;
    private String phoneNumber;
    private String password;
    private String email;
    private Date dob;
    private String status;
    private List<RoleResponse> roles;

    @Getter
    @Setter
    public class RoleResponse extends BaseResponse{
        private String code;
        private String name;
        private String status;
    }
}
