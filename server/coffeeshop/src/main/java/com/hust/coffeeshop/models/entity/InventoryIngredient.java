package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "inventory_ingredient")
public class InventoryIngredient extends BaseEntity{
    @Column(name = "name")
    private String name ;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "ingredient_id")
    private int ingredientId ;

    @Column(name = "inventory_id")
    private int inventoryId ;

    @Column(name = "status")
    private int status ;

    @Column(name = "ingredient_money")
    private BigDecimal ingredientMoney ;
}
