package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ingredient")
@Getter
@Setter
public class Ingredient extends BaseEntity{
    @Column(name = "name")
    private String name ;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "status")
    private int status;

    @Column(name = "stock_unit_id")
    private Integer stockUnitId;

    @Column(name = "export_price")
    private BigDecimal exportPrice;
}
