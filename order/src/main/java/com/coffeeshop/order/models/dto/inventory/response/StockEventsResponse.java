package com.coffeeshop.order.models.dto.inventory.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockEventsResponse {
    //lượng thay đổi cửa nguyên liệu
   private String amountChargeInUnit;
   private long createdOn;
   private int objectId;
   private String code;
   private String type;
   private String note;
   private int stockRemain;
}
