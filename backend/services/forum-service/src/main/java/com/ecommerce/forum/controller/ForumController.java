package com.ecommerce.forum.controller;

import com.ecommerce.forum.model.Comment;
import com.ecommerce.forum.model.Discussion;
import com.ecommerce.forum.repository.CommentRepository;
import com.ecommerce.forum.repository.DiscussionRepository;
import com.ecommerce.forum.service.ForumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/forum")
public class ForumController {

    private final DiscussionRepository discussionRepository;
    private final CommentRepository commentRepository;
    private final ForumService forumService;

    public ForumController(DiscussionRepository discussionRepository, CommentRepository commentRepository, ForumService forumService) {
        this.discussionRepository = discussionRepository;
        this.commentRepository = commentRepository;
        this.forumService = forumService;
    }

    @GetMapping("/discussions")
    public ResponseEntity<List<Discussion>> getDiscussions(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String q) {
        String searchQuery = (q != null && !q.isBlank()) ? q.trim() : null;
        List<Discussion> discussions;
        if (searchQuery != null) {
            discussions = categoryId != null
                    ? discussionRepository.searchByCategoryIdOrderByCreatedAtDesc(categoryId, searchQuery)
                    : discussionRepository.searchOrderByCreatedAtDesc(searchQuery);
        } else {
            discussions = categoryId != null
                    ? discussionRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId)
                    : discussionRepository.findAllByOrderByCreatedAtDesc();
        }
        forumService.applyBadges(discussions);
        discussions = forumService.sortWithPinnedFirst(new ArrayList<>(discussions));
        return ResponseEntity.ok(discussions);
    }

    @GetMapping("/discussions/{id}")
    public ResponseEntity<Discussion> getDiscussion(@PathVariable Long id) {
        Optional<Discussion> opt = discussionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Discussion d = opt.get();
        d.setViews(d.getViews() + 1);
        discussionRepository.save(d);
        d.setBadge(forumService.computeBadge(d));
        return ResponseEntity.ok(d);
    }

    @PostMapping("/discussions")
    public ResponseEntity<Discussion> createDiscussion(@RequestBody Discussion discussion) {
        discussion.setUpvotes(0);
        discussion.setComments(0);
        discussion.setViews(0);
        Discussion saved = discussionRepository.save(discussion);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/discussions/{id}")
    public ResponseEntity<Discussion> updateDiscussion(
            @PathVariable Long id,
            @RequestBody Discussion updates) {
        Optional<Discussion> opt = discussionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Discussion existing = opt.get();
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getContent() != null) existing.setContent(updates.getContent());
        if (updates.getCategoryId() != null) existing.setCategoryId(updates.getCategoryId());
        if (updates.getBadge() != null) {
            existing.setBadge("pinned".equals(updates.getBadge()) ? "pinned" : null);
        }
        Discussion saved = discussionRepository.save(existing);
        saved.setBadge(forumService.computeBadge(saved));
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/discussions/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable Long id) {
        if (!discussionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteByDiscussionId(id);
        discussionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/discussions/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        if (!discussionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(commentRepository.findByDiscussionIdOrderByCreatedAtAsc(id));
    }

    @PostMapping("/discussions/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, @RequestBody Comment comment) {
        Optional<Discussion> opt = discussionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        comment.setDiscussionId(id);
        Comment saved = commentRepository.save(comment);
        Discussion d = opt.get();
        d.setComments((int) commentRepository.countByDiscussionId(id));
        discussionRepository.save(d);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/discussions/{discussionId}/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long discussionId,
            @PathVariable Long commentId,
            @RequestBody Comment updates) {
        Optional<Comment> opt = commentRepository.findById(commentId);
        if (opt.isEmpty() || !opt.get().getDiscussionId().equals(discussionId)) {
            return ResponseEntity.notFound().build();
        }
        Comment existing = opt.get();
        if (updates.getContent() != null) existing.setContent(updates.getContent());
        return ResponseEntity.ok(commentRepository.save(existing));
    }

    @DeleteMapping("/discussions/{discussionId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long discussionId,
            @PathVariable Long commentId) {
        Optional<Comment> opt = commentRepository.findById(commentId);
        if (opt.isEmpty() || !opt.get().getDiscussionId().equals(discussionId)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(commentId);
        Optional<Discussion> dOpt = discussionRepository.findById(discussionId);
        if (dOpt.isPresent()) {
            Discussion d = dOpt.get();
            d.setComments((int) commentRepository.countByDiscussionId(discussionId));
            discussionRepository.save(d);
        }
        return ResponseEntity.noContent().build();
    }
}
