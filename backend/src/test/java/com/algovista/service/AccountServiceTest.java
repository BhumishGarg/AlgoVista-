package com.algovista.service;

import com.algovista.dto.ApiDtos.SignupRequest;
import com.algovista.entity.UserAccount;
import com.algovista.repository.BookmarkRepository;
import com.algovista.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AccountServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final BookmarkRepository bookmarks = mock(BookmarkRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final AccountService service = new AccountService(users, bookmarks, encoder);

    @Test
    void registrationNormalizesEmailAndStoresOnlyPasswordHash() {
        when(users.existsByEmail("learner@example.com")).thenReturn(false);
        when(users.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserAccount account = service.register(new SignupRequest("Learner", " Learner@Example.com ", "safe-password"));

        assertEquals("learner@example.com", account.getEmail());
        assertNotEquals("safe-password", account.getPassword());
        assertTrue(encoder.matches("safe-password", account.getPassword()));
        verify(users).save(any(UserAccount.class));
    }

    @Test
    void emailNormalizationIsLocaleIndependent() {
        assertEquals("user@example.com", AccountService.normalizeEmail(" USER@EXAMPLE.COM "));
    }

    @Test
    void registrationRejectsPasswordsThatWouldBeTruncatedByBcrypt() {
        assertThrows(ResponseStatusException.class,
                () -> service.register(new SignupRequest("Learner", "learner@example.com", "😀".repeat(19))));
        verify(users, never()).save(any(UserAccount.class));
    }
}
