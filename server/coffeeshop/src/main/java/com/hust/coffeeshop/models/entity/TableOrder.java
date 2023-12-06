package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Getter
@Setter
@javax.persistence.Table(name = "table_order")
@Entity
public class TableOrder extends BaseEntity{
    @Column(name = "order_id")
    private int Order_Id;
    @Column(name = "table_id")
    private int table_id;
    @Column(name = "status")
    private int status;
}
