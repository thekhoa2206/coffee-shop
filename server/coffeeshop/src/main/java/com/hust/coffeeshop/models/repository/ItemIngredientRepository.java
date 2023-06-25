package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemIngredientRepository  extends JpaRepository<ItemIngredient, Integer>, JpaSpecificationExecutor<ItemIngredient> {
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE item_id = ?1 AND ingredient_id=?2", nativeQuery = true)
    ItemIngredient findItemIngredientByItemIdAndIngredientId(int  itemId, int ingredientId);
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE  ingredient_id=?1", nativeQuery = true)
    List<ItemIngredient>  findItemIngredientByIngredientId( int ingredientId);
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE item_id = ?1 ", nativeQuery = true)
    List<ItemIngredient> findItemIngredientByItemId(int  itemId);
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE variant_id = ?1 AND item_id = ?2 ", nativeQuery = true)
    List<ItemIngredient> findItemIngredientByVariantIdAndItemId(int  variantId, int  itemId);
    @Query(value = "SELECT item_ingredient.* FROM item_ingredient WHERE variant_id in (?1)", nativeQuery = true)
    List<ItemIngredient> findItemIngredientByVariantIds(List<Integer> variantIds);

}