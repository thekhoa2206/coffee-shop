package com.coffeeshop.order.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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
