package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "inventory_log")
@Getter
@Setter
public class InventoryLog extends BaseEntity{
    @Column(name = "code")
    private String code;
    @Column(name = "type")
    private String type;
    @Column(name = "note")
    private String note;
    @Column(name = "amount_charge_in_unit")
    private String amountChargeInUnit;
    @Column(name = "status")
    private int status;
    @Column(name = "ingredient_id")
    private int ingredientId;
    @Column(name = "object_id")
    private int objectId;
    @Column(name = "stock_remain")
    private int stockRemain;


}
