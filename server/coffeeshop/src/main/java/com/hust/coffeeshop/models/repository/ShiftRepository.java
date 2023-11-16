package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Shift;
import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Integer>, JpaSpecificationExecutor<Shift> {
    @Query(value = "SELECT * FROM shift WHERE user_start_id = ?1 AND status =1   ", nativeQuery = true)
    Shift findShiftByUserId(int user_id);

}
