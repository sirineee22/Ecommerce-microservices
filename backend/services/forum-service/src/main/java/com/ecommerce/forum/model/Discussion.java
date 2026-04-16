package com.ecommerce.forum.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "discussions")
public class Discussion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String content;

    @Column(nullable = false)
    private String categoryId;

    @Column(nullable = false)
    private String authorId;

    @Column(nullable = false)
    private String authorName;

    private int upvotes = 0;
    private int comments = 0;
    private int views = 0;

    private String badge; // pinned, hot, new, popular

    @Column(updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }

    public int getComments() { return comments; }
    public void setComments(int comments) { this.comments = comments; }

    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
