package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "stocktakings")
@Entity
public class Stocktaking extends BaseEntity{
    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private int status;
    @Column(name = "payment")
    private int payment;

    @Column(name = "total_money")
    private BigDecimal totalMoney;
    @Column(name = "description")
    private String description;
    @Column(name = "partner")
    private String partner;
}
