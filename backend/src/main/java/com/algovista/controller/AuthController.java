package com.algovista.controller;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.UserAccount;
import com.algovista.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AccountService accounts;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository contextRepository;

    public AuthController(AccountService accounts, AuthenticationManager authenticationManager,
                          SecurityContextRepository contextRepository) {
        this.accounts = accounts; this.authenticationManager = authenticationManager; this.contextRepository = contextRepository;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token) { return Map.of("token", token.getToken()); }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserAccount user)) return new MeResponse(null);
        return new MeResponse(accounts.response(accounts.requireAccount(user.getId())));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request,
                                               HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        UserAccount user = accounts.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(authenticate(user.getEmail(), request.password(), servletRequest, servletResponse)));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request,
                              HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        AccountService.validatePasswordLength(request.password());
        String email = AccountService.normalizeEmail(request.email());
        try {
            UserAccount user = (UserAccount) authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())).getPrincipal();
            return new AuthResponse(saveContext(user, servletRequest, servletResponse));
        } catch (BadCredentialsException ex) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        contextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);
        return ResponseEntity.noContent().build();
    }

    private UserResponse authenticate(String email, String password, HttpServletRequest request, HttpServletResponse response) {
        UserAccount user = (UserAccount) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)).getPrincipal();
        return saveContext(user, request, response);
    }

    private UserResponse saveContext(UserAccount user, HttpServletRequest request, HttpServletResponse response) {
        var existingSession = request.getSession(false);
        if (existingSession != null) existingSession.invalidate();
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
        return accounts.response(user);
    }
}
