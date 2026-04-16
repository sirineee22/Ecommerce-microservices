package com.ecommerce.forum.repository;

import com.ecommerce.forum.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByDiscussionIdOrderByCreatedAtAsc(Long discussionId);

    void deleteByDiscussionId(Long discussionId);

    long countByDiscussionId(Long discussionId);
}
