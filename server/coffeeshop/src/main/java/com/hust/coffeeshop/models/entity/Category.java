package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
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
