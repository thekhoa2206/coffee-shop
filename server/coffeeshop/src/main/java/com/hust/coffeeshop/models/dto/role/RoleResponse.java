package com.hust.coffeeshop.models.dto.role;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RoleResponse extends BaseResponse {
    private String name;
    private String scopes;
}
