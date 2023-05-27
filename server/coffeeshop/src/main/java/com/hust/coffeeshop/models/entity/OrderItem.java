package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Table(name = "order_item")
@Entity
public class OrderItem extends BaseEntity {
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "combo")
    private boolean combo;

    @Column(name = "status")
    private int status;

    @Column(name = "price")
    private String price;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "name")
    private String name;
}
