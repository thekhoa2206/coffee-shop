package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemIngredientRepository  extends JpaRepository<ItemIngredient, Integer>, JpaSpecificationExecutor<ItemIngredient> {
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE item_id = ?1 AND ingredient_id=?2", nativeQuery = true)
    ItemIngredient findItemIngredientByItemIdAndIngredientId(int  itemId, int ingredientId);
    @Query(value = "DELETE item_ingredient.* FROM item_ingredient WHERE item_id = ?1 AND ingredient_id=?2", nativeQuery = true)
    void deleteItemIngredient(int  itemId, int ingredientId);
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE item_id = ?1 ", nativeQuery = true)
    List<ItemIngredient> findItemIngredientByItemId(int  itemId);
}