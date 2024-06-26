package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.Table;
@Entity
@Table(name = "item")
@Getter
@Setter
public class Item  extends BaseEntity{
    @Column(name = "name")
    private String name;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "description")
    private String description;
    @Column(name = "discount_percentage")
    private BigDecimal discountPercentage;
    @Column(name = "stock_unit_id")
    private int stockUnitId;
    @Column(name = "status")
    private int status;
    @Column(name = "category_id")
    private int categoryId;



}
