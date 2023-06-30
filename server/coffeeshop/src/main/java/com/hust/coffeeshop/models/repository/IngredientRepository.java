package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Ingredient;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.StockUnit;
import com.hust.coffeeshop.models.entity.Variant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer>, JpaSpecificationExecutor<Ingredient> {
    @Query(value = "SELECT ingredient.* FROM ingredient WHERE id in (?1)", nativeQuery = true)
    List<Ingredient> findByIds(List<Integer> ids);
    //xét số lượng  kỳ
    @Query(value = "SELECT ingredient.quantity FROM ingredient WHERE created_on<=?1 AND id=?2 ", nativeQuery = true)
    Integer CountbyId(long date, int id);
    @Query(value = "SELECT ingredient.* FROM ingredient WHERE created_on >=?1 AND created_on <=?2 ", nativeQuery = true)
    Page<Ingredient> findByDate(long startDate, long endDate, Pageable var1);

}
