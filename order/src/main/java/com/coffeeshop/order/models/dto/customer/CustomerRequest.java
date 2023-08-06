package com.coffeeshop.order.models.dto.customer;

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
    private String type;
}
