package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "combo")
@Getter
@Setter
public class Combo  extends BaseEntity{
    @Column(name = "name")
    private String name;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "description")
    private String description;
    @Column(name= "price")
    private BigDecimal price;
    @Column(name = "discount_percentage")
    private String discountPercentage;
    @Column(name = "status")
    private String status;
    @Column(name = "category_id")
    private int categoryId;

}
