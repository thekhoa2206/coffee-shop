package com.coffeeshop.order.models.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BaseResponse {
    private Integer id;
    private long createdOn;
    private String createdBy;
    private long modifiedOn;
    private String modifiedBy;
    private Date createdDate;
    private Date modifiedDate;
    public void set() {
        this.createdDate = new Date(this.createdOn);
        this.createdDate = new Date(this.modifiedOn);
    }

}
