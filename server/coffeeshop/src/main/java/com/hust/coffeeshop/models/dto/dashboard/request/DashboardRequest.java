package com.hust.coffeeshop.models.dto.dashboard.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class DashboardRequest {
   private String startDate;
   private String endDate;
}
