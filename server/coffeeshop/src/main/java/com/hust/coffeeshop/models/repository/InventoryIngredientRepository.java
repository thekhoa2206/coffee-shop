package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.InventoryIngredient;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryIngredientRepository extends JpaRepository<InventoryIngredient, Integer>, JpaSpecificationExecutor<InventoryIngredient> {
    @Query(value = "SELECT inventory_ingredient.* FROM inventory_ingredient WHERE inventory_id = ?1", nativeQuery = true)
    List<InventoryIngredient> findItemIngredientByInventoryId(int inventory_id);
}
