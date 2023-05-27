package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Table(name = "inventory")
@Entity
public class Inventory extends BaseEntity{
    @Column(name = "code")
    private String code;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private int status;
}
