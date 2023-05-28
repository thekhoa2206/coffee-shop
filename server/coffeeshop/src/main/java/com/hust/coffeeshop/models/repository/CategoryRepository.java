package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository  extends JpaRepository<Category, Integer>, JpaSpecificationExecutor<Category> {
}
