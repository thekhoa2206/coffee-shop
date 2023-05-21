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
    private Date createdOn;
    private Integer createdBy;
    private Date modifiedOn;
    private Integer modifiedBy;
}
