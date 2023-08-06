package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "customer")
@Getter
@Setter
public class Customer extends BaseEntity{
    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "dob")
    private long dob;

    @Column(name = "sex")
    private String sex;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private int status;
}
