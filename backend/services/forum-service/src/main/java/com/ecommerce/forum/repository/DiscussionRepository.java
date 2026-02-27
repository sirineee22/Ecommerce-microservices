package com.ecommerce.forum.repository;

import com.ecommerce.forum.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {

    List<Discussion> findByCategoryIdOrderByCreatedAtDesc(String categoryId);

    List<Discussion> findAllByOrderByCreatedAtDesc();

    @Query("SELECT d FROM Discussion d WHERE (LOWER(d.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.content) LIKE LOWER(CONCAT('%', :q, '%'))) ORDER BY d.createdAt DESC")
    List<Discussion> searchOrderByCreatedAtDesc(@Param("q") String q);

    @Query("SELECT d FROM Discussion d WHERE d.categoryId = :categoryId AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.content) LIKE LOWER(CONCAT('%', :q, '%'))) ORDER BY d.createdAt DESC")
    List<Discussion> searchByCategoryIdOrderByCreatedAtDesc(@Param("categoryId") String categoryId, @Param("q") String q);
}
