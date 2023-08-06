package com.coffeeshop.order.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "role")
@Entity
@Getter
@Setter
public class Role extends BaseEntity {
    @Column(name = "code")
    private String code;

    @Column(name = "status")
    private String status;

    @Column(name = "name")
    private String name;


    @Column(name = "scopes")
    private String scopes;
}
