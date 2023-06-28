package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.InventoryLog;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Integer>, JpaSpecificationExecutor<InventoryLog> {
    @Query(value = "SELECT inventory_log.* FROM inventory_log WHERE object_id = ?1 AND ingredient_id =?2", nativeQuery = true)
   InventoryLog findInventoryLogByObjectId(int objectId,int ingredientId);
}
