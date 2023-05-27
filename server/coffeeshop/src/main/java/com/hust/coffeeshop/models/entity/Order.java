package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Table;
import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "order")
public class Order extends BaseEntity{
    @Column(name = "customer_id")
    private int customerId;

    @Column(name = "user_id")
    private int userId ;

    @Column(name = "status")
    private int status ;

    @Column(name = "total")
    private BigDecimal total ;

    @Column(name = "discount_total")
    private BigDecimal discount_total;

    @Column(name = "note")
    private String note;
}
