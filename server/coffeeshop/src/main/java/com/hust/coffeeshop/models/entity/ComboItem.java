package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "combo_item")
@Getter
@Setter
public class ComboItem  extends BaseEntity{
    @Column(name = "combo_id")
    private int comboId;
    @Column(name = "item_id")
    private int itemId;
    @Column(name = "variant_id")
    private int variantId;

}
