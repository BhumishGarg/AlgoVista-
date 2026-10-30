package com.algovista.controller;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.UserAccount;
import com.algovista.service.AccountService;
import com.algovista.service.BookmarkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AccountController {
    private final AccountService accounts;
    private final BookmarkService bookmarks;
    public AccountController(AccountService accounts, BookmarkService bookmarks) { this.accounts = accounts; this.bookmarks = bookmarks; }

    @GetMapping("/users/me")
    public UserResponse profile(Authentication authentication) {
        return accounts.response(accounts.requireAccount(current(authentication).getId()));
    }
    @PutMapping("/users/me")
    public UserResponse update(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        return accounts.updateProfile(current(authentication).getId(), request);
    }
    @GetMapping("/bookmarks")
    public List<QuestionSummary> bookmarks(Authentication authentication) { return bookmarks.list(current(authentication)); }
    @PostMapping("/bookmarks/{questionId}")
    public ResponseEntity<Void> addBookmark(@PathVariable Long questionId, Authentication authentication) {
        bookmarks.add(current(authentication), questionId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @DeleteMapping("/bookmarks/{questionId}")
    public ResponseEntity<Void> removeBookmark(@PathVariable Long questionId, Authentication authentication) {
        bookmarks.remove(current(authentication), questionId);
        return ResponseEntity.noContent().build();
    }
    private UserAccount current(Authentication authentication) { return (UserAccount) authentication.getPrincipal(); }
}
