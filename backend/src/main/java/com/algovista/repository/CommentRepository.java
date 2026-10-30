package com.algovista.repository;

import com.algovista.entity.CommentEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<CommentEntry, Long> {
    Page<CommentEntry> findAllByQuestionIdOrderByCreatedAtDesc(Long questionId, Pageable pageable);
}
