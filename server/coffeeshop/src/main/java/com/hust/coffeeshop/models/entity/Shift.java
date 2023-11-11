package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Table(name = "shift")
@Entity
@Getter
@Setter
public class Shift extends BaseEntity{
    @Column(name = "code")
    private String code;

    @Column(name = "status")
    private int status;

    @Column(name = "shift_turnover")
    private BigDecimal shiftTurnover;

    @Column(name = "user_start_id")
    private int userStartId;

    @Column(name = "user_end_id")
    private int userEndId;


    @Column(name = "money_order")
    private BigDecimal moneyOrder;
    @Column(name = "total_order")
    private int totalOrder;

    @Column(name = "export_money")
    private BigDecimal export_money;
    @Column(name = "total_export")
    private int totalExport;

    @Column(name = "import_money")
    private BigDecimal importMoney;
    @Column(name = "import_total")
    private int importTotal;

    @Column(name = "money_cancel_order")
    private BigDecimal money_cancel_order;
    @Column(name = "total_order_cancel")
    private int total_order_cancel;

    @Column(name = "money_export_cancel")
    private BigDecimal money_export_cancel;
    @Column(name = "total_export_cancel")
    private int total_export_cancel;

    @Column(name = "money_import_cancel")
    private BigDecimal money_import_cancel;
    @Column(name = "total_import_cancel")
    private int total_import_cancel;
}
