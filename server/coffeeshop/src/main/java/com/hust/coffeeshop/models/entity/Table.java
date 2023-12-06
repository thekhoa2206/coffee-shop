package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Getter
@Setter
@javax.persistence.Table(name = "tables")
@Entity
public class Table extends BaseEntity {
    @Column(name = "name")
    private String name;
    @Column(name = "status")
    private int status;

}
