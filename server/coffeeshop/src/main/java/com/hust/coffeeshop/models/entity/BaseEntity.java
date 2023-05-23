package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
    @Id // xác định đây là khoá chính.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment.
    @Column(name = "id")
    private Integer id;

    @Column(name = "created_on")
    private Long createdOn;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "modified_on")
    private Long modifiedOn;

    @Column(name = "modified_by")
    private Integer modifiedBy;
}
