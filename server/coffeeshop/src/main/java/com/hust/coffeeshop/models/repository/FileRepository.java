package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.File;
import com.hust.coffeeshop.models.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<File, Integer>, JpaSpecificationExecutor<File> {

}
