package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Table(name = "shift_object")
@Entity
@Getter
@Setter
public class ShiftObject extends BaseEntity{
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "shift_id")
    private int shiftId;

    @Column(name = "status")
    private String status;

    @Column(name = "type")
    private String type;

    @Column(name = "money")
    private BigDecimal money;
}
