package com.algovista.controller;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.UserAccount;
import com.algovista.service.AccountService;
import com.algovista.service.CommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Validated
public class CommentController {
    private final CommentService comments;
    private final AccountService accounts;
    public CommentController(CommentService comments, AccountService accounts) {
        this.comments = comments;
        this.accounts = accounts;
    }
    @GetMapping("/questions/{questionId}/comments")
    public PageResponse<CommentResponse> list(@PathVariable Long questionId,
            @RequestParam(defaultValue = "0") @Min(0) @Max(10000) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return comments.list(questionId, page, size);
    }
    @PostMapping("/questions/{questionId}/comments")
    public ResponseEntity<CommentResponse> create(@PathVariable Long questionId,
            @Valid @RequestBody CommentRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(comments.create(current(authentication), questionId, request.content()));
    }
    @PutMapping("/comments/{commentId}")
    public CommentResponse update(@PathVariable Long commentId, @Valid @RequestBody CommentRequest request,
                                  Authentication authentication) {
        return comments.update(current(authentication), commentId, request.content());
    }
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId, Authentication authentication) {
        comments.delete(current(authentication), commentId);
        return ResponseEntity.noContent().build();
    }
    private UserAccount current(Authentication authentication) {
        UserAccount principal = (UserAccount) authentication.getPrincipal();
        return accounts.requireAccount(principal.getId());
    }
}
