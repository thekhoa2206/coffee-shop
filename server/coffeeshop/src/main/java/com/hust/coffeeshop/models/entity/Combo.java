package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
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
    private BigDecimal discountPercentage;
    @Column(name = "status")
    private int status;
    @Column(name = "category_id")
    private int categoryId;

}
