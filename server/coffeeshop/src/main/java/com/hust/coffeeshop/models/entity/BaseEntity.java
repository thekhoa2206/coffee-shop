package com.hust.coffeeshop.models.entity;

import com.hust.coffeeshop.common.CommonCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "modified_on")
    private long modifiedOn;

    @Column(name = "modified_by")
    private Integer modifiedBy;

    public void setCreatedOn(){
        this.createdOn = CommonCode.getTimestamp();
    }
    public void setModifiedOn(){
        this.modifiedOn = CommonCode.getTimestamp();
    }
}
