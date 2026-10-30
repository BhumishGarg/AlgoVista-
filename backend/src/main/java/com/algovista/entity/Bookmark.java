package com.algovista.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "bookmarks", uniqueConstraints = @UniqueConstraint(name = "uq_bookmark_user_question", columnNames = {"user_id", "question_id"}))
public class Bookmark {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    protected Bookmark() {}
    public Bookmark(UserAccount user, Question question) { this.user = user; this.question = question; }
    @PrePersist void onCreate() { createdAt = Instant.now(); }
    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public Question getQuestion() { return question; }
}
