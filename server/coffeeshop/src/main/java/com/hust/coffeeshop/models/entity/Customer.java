package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
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

    @Column(name = "status")
    private int status;
}
