package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "stocktaking_ingredient")
public class StocktakingIngredient extends BaseEntity{

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "ingredient_id")
    private int ingredientId ;

    @Column(name = "stocktaking_id")
    private int stocktakingId ;

    @Column(name = "status")
    private int status ;

    @Column(name = "ingredient_money")
    private BigDecimal ingredientMoney ;
}
