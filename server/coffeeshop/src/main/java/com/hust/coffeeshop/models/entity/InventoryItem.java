package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "inventory_item")
public class InventoryItem extends BaseEntity{
    @Column(name = "name")
    private String name ;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "item_id")
    private int itemId ;

    @Column(name = "inventory_id")
    private int inventoryId ;
}
