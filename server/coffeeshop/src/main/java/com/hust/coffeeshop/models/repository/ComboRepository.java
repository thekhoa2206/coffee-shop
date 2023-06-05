package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Combo;
import com.hust.coffeeshop.models.entity.ComboItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboRepository  extends JpaRepository<Combo, Integer>, JpaSpecificationExecutor<Combo> {
    @Query(value = "Select * from combo as o " +
            "where o.status = 1 and (concat(o.name, '', o.description) like ?1 " +
            "or EXISTS ( " +
            "Select * from combo_item as ci " +
            "where " +
            "ci.combo_id = o.id " +
            "and ci.status = 1 and " +
            "EXISTS(" +
            "Select * FROM variant as v " +
            "where " +
            "v.id = ci.variant_id and v.status = 1 and " +
            "and v.status = 1 and " +
            "concat(v.name, '') like ?1 )));", nativeQuery = true)
    ComboItem findComboByQuery(int comboId, int status);
}
