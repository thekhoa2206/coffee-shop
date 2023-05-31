package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "item_ingredient")
@Getter
@Setter
public class ItemIngredient extends BaseEntity{
    @Column(name = "item_id")
    private int itemId;
    @Column(name = "ingredient_id")
    private int ingredientId;
    @Column(name = "amount_consume")
    private int amountConsume;
    @Column(name = "variant_id")
    private int variantId;
}
