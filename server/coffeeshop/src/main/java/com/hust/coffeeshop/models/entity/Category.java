package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "category")
@Getter
@Setter
public class Category extends BaseEntity{
    @Column(name = "name")
    private String name;
    @Column(name = "status")
    private int status;

}
