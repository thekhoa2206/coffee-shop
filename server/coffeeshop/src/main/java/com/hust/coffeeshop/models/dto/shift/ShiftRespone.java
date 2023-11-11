package com.hust.coffeeshop.models.dto.shift;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.math.BigDecimal;
@Getter
@Setter
public class ShiftRespone extends BaseResponse {
    private String code;
    private String status;
    private BigDecimal shiftTurnover;
    private int userStartId;
    private String userStart;
    private int userEndId;
    private String userEnd;
    private BigDecimal moneyOrder;
    private int totalOrder;
    private BigDecimal export_money;
    private int totalExport;
    private BigDecimal importMoney;
    private int importTotal;
    private BigDecimal money_cancel_order;
    private int total_order_cancel;
    private BigDecimal money_export_cancel;
    private int total_export_cancel;
    private BigDecimal money_import_cancel;
    private int total_import_cancel;
}
