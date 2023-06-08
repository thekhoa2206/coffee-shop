package com.hust.coffeeshop.models.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
