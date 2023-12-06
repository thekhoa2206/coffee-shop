package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<Table, Integer>, JpaSpecificationExecutor<Table> {}