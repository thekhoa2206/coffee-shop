package com.coffeeshop.order.models.entity;

import com.coffeeshop.order.common.CommonCode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_log")
@Getter
@Setter
public class OrderLog{
    @Id // xác định đây là khoá chính.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment.
    @Column(name = "id")
    private Integer id;

    @Column(name = "data")
    private String data;

    @Column(name = "actor")
    private Integer actor;

    @Column(name = "action")
    private String action;

    @Column(name = "created_on")
    private long createdOn;

    @Column(name = "modified_on")
    private long modifiedOn;

    public void setCreatedOn(){
        this.createdOn = CommonCode.getTimestamp();
    }
    public void setModifiedOn(){
        this.modifiedOn = CommonCode.getTimestamp();
    }
}
