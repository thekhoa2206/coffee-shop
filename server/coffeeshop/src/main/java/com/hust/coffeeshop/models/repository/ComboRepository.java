package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboRepository  extends JpaRepository<Combo, Integer>, JpaSpecificationExecutor<Combo> {
}
