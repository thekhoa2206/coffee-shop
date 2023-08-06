package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "variant")
@Getter
@Setter
public class Variant extends BaseEntity {
    @Column(name = "name")
    private String name;
    @Column(name = "status")
    private int status;
    @Column(name= "price")
    private BigDecimal price;
    @Column(name= "item_id")
    private int itemId;
}
