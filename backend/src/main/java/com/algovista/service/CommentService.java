package com.algovista.service;

import com.algovista.dto.ApiDtos.CommentResponse;
import com.algovista.entity.CommentEntry;
import com.algovista.entity.Question;
import com.algovista.entity.UserAccount;
import com.algovista.repository.CommentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository comments;
    private final CatalogService catalog;
    public CommentService(CommentRepository comments, CatalogService catalog) { this.comments = comments; this.catalog = catalog; }

    @Transactional(readOnly = true)
    public com.algovista.dto.ApiDtos.PageResponse<CommentResponse> list(Long questionId, int page, int size) {
        catalog.requireQuestion(questionId);
        var result = comments.findAllByQuestionIdOrderByCreatedAtDesc(questionId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return new com.algovista.dto.ApiDtos.PageResponse<>(result.getContent().stream().map(this::response).toList(),
                result.getTotalElements(), result.getTotalPages(), result.getNumber(), result.getSize());
    }
    @Transactional
    public CommentResponse create(UserAccount user, Long questionId, String content) {
        Question question = catalog.requireQuestion(questionId);
        return response(comments.save(new CommentEntry(user, question, content.trim())));
    }
    @Transactional
    public CommentResponse update(UserAccount user, Long commentId, String content) {
        CommentEntry entry = requireComment(commentId);
        if (!entry.getUser().getId().equals(user.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own comments.");
        entry.setContent(content.trim());
        return response(entry);
    }
    @Transactional
    public void delete(UserAccount user, Long commentId) {
        CommentEntry entry = requireComment(commentId);
        if (!entry.getUser().getId().equals(user.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments.");
        comments.delete(entry);
    }
    private CommentEntry requireComment(Long id) {
        return comments.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found."));
    }
    private CommentResponse response(CommentEntry entry) {
        return new CommentResponse(entry.getId(), entry.getUser().getId(), entry.getUser().getFullName(),
                entry.getContent(), entry.getCreatedAt(), entry.getUpdatedAt());
    }
}
