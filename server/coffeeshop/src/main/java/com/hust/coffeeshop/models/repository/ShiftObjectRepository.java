package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Shift;
import com.hust.coffeeshop.models.entity.ShiftObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShiftObjectRepository extends JpaRepository<ShiftObject, Integer>, JpaSpecificationExecutor<ShiftObject> {
    @Query(value = "SELECT * FROM shift_object WHERE shift_id = ?1   ", nativeQuery = true)
    List<ShiftObject> findByShiftId(int shift_id);
    @Query(value = "SELECT * FROM shift_object WHERE object_id = ?1 AND status =1   ", nativeQuery = true)
    ShiftObject findShiftByObject(int object_id);
}
