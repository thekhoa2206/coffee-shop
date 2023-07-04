package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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
