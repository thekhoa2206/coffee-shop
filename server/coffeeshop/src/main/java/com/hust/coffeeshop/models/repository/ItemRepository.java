package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Combo;
import com.hust.coffeeshop.models.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository  extends JpaRepository<Item, Integer>, JpaSpecificationExecutor<Item> {
    @Query(value = "Select * from item as i " +
            "where status in (?2) " +
            "and (concat(i.name, '', i.description) like ?1 " +
            "or exists(Select * from variant as v " +
            "where v.status in (?2) " +
            "and v.item_id = i.id " +
            "and concat(v.name, '') like ?1 " +
            "    )" +
            ");", nativeQuery = true)
    List<Item> findItemByQuery(String query, List<Integer> statuses);

    @Query(value = "SELECT item.* FROM item WHERE id =?1 ", nativeQuery = true)
    List<Item> findItemByIngredient( Integer ingredientId );

}
