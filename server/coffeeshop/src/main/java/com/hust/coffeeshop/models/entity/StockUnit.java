<<<<<<< .mine
package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Table(name = "stock_unit")
@Entity
public class StockUnit extends BaseEntity{
    @Column(name = "name")
    private String name;

    @Column(name = "status")
    private int status;
}
=======
package com.hust.coffeeshop.models.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "stock_unit")
@Getter
@Setter
public class StockUnit extends BaseEntity{
    @Column(name = "name")
    private String name;
    @Column(name = "status")
    private String status;

}
>>>>>>> .theirs
