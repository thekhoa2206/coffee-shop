package com.coffeeshop.order.models.entity;

import com.coffeeshop.order.common.CommonCode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
    @Id // xác định đây là khoá chính.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment.
    @Column(name = "id")
    private Integer id;

    @Column(name = "created_on")
    private long createdOn;

    @Column(name = "modified_on")
    private long modifiedOn;

    @Column(name = "created_by")
    private String createdBy;


    @Column(name = "modified_by")
    private String modifiedBy;

    public void setCreatedOn(){
        this.createdOn = CommonCode.getTimestamp();
    }
    public void setModifiedOn(){
        this.modifiedOn = CommonCode.getTimestamp();
    }
}
