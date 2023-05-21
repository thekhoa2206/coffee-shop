package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    @Query(value = "SELECT user.* FROM user WHERE username = ?1", nativeQuery = true)
    User findUserByUsername(String username);
    Optional<User> findByUsername(String username);

//    @Query(value = "SELECT user.* FROM user WHERE id = ?1", nativeQuery = true)
//    User findUserById(int id);
//    Optional<User> findById(int id);

    Boolean existsByUsername(String username);
}
