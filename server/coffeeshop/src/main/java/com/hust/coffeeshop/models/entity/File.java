package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "file")
@Getter
@Setter
public class File {
    @Id // xác định đây là khoá chính.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment.
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "path")
    private String path;
    @Column(name = "type")
    private String type;
    @Column(name = "item_id")
    private int itemId ;
    @Column(name = "size")
    private long size ;
}
