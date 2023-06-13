package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Getter
@Setter
@Table(name = "order_item_combo")
@Entity
public class OrderItemCombo extends BaseEntity{
    @Column(name = "name")
    private String name;

    @Column(name = "status")
    private int status;

    @Column(name = "order_id")
    private int orderId;

    @Column(name = "order_item_id")
    private int orderItemId;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "combo_item_id")
    private int comboItemId;

}
