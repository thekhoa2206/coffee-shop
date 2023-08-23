package com.coffeeshop.order.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "combo_item")
@Getter
@Setter
public class ComboItem extends BaseEntity{
    @Column(name = "combo_id")
    private int comboId;
    @Column(name = "item_id")
    private int itemId;
    @Column(name = "variant_id")
    private int variantId;
    @Column(name = "quantity")
    private int quantity;
    @Column(name = "status")
    private int status;

}
