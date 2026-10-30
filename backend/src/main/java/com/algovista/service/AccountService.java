package com.algovista.service;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.UserAccount;
import com.algovista.repository.BookmarkRepository;
import com.algovista.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.nio.charset.StandardCharsets;

@Service
public class AccountService implements UserDetailsService {
    private final UserRepository users;
    private final BookmarkRepository bookmarks;
    private final PasswordEncoder passwordEncoder;

    public AccountService(UserRepository users, BookmarkRepository bookmarks, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.bookmarks = bookmarks;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserAccount loadUserByUsername(String email) throws UsernameNotFoundException {
        return users.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password."));
    }

    @Transactional
    public UserAccount register(SignupRequest request) {
        validatePasswordLength(request.password());
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        UserAccount account = new UserAccount(request.fullName().trim(), email, passwordEncoder.encode(request.password()));
        return users.save(account);
    }

    @Transactional(readOnly = true)
    public UserAccount requireAccount(Long id) {
        return users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to continue."));
    }

    @Transactional
    public UserResponse updateProfile(Long id, ProfileUpdateRequest request) {
        UserAccount account = requireAccount(id);
        account.setFullName(request.fullName().trim());
        return response(account);
    }

    @Transactional(readOnly = true)
    public UserResponse response(UserAccount account) {
        return new UserResponse(account.getId(), account.getFullName(), account.getEmail(),
                account.getCreatedAt(), bookmarks.countByUserId(account.getId()), 0);
    }

    public static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public static void validatePasswordLength(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must not exceed 72 UTF-8 bytes.");
        }
    }
}
