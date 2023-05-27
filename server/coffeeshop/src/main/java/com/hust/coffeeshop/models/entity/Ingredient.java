package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "ingredient")
@Getter
@Setter
public class Ingredient extends BaseEntity{
    @Column(name = "name")
    private String name ;

    @Column(name = "quantity")
    private String quantity;

    @Column(name = "status")
    private int status;

    @Column(name = "stock_unit_id")
    private String stockUnitId;

    @Column(name = "export_price")
    private BigDecimal exportPrice;
}
