package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Combo;
import com.hust.coffeeshop.models.entity.ComboItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboRepository  extends JpaRepository<Combo, Integer>, JpaSpecificationExecutor<Combo> {
    //filter combo theo query(tên variant, tên sản phẩm, tên combo)
    @Query(value = "Select * from combo as o " +
            "where o.status in (?2) and (lower(concat(o.name, '', o.description)) like lower(?1) " +
            "or EXISTS ( Select * from combo_item as ci where " +
            "ci.combo_id = o.id " +
            "and ci.status in (?2) and " +
            "(EXISTS(" +
            "Select * FROM variant as v " +
            "where " +
            "v.id = ci.variant_id " +
            "and v.status in (?2) and " +
            "lower(concat(v.name, '')) like lower(?1) )) " +
            "or EXISTS( " +
            "Select * FROM item as i " +
            "where " +
            "i.id = ci.item_id " +
            "and i.status in (?2)  and " +
            "lower(concat(i.name, '', i.description)) like lower(?1)))); ", nativeQuery = true)
    List<Combo> findComboByQuery(String query, List<Integer> statuses);
}
