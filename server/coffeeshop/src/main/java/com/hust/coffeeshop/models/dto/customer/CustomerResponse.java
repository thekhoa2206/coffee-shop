package com.hust.coffeeshop.models.dto.customer;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CustomerResponse extends BaseResponse {
    private String name;
    private String phoneNumber;
    private Date dob;
    private int status;
    private String sex;
    private String type;
}
