package com.coffeeshop.order.models.dto.dashboard.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DashboardRequest {
   private String createdOnMin;
   private String createdOnMax;
}
