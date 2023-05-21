package com.hust.coffeeshop.models.dto.customer;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class CustomerRequest {
    private String name;
    private String phoneNumber;
    private Date dob;
    private String sex;
}
