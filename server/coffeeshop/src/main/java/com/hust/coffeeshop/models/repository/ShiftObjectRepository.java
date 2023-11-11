package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ShiftObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShiftObjectRepository extends JpaRepository<ShiftObject, Integer>, JpaSpecificationExecutor<ShiftObject> {
}
