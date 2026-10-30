package com.algovista.controller;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.UserAccount;
import com.algovista.service.CatalogService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class CatalogController {
    private final CatalogService catalog;
    public CatalogController(CatalogService catalog) { this.catalog = catalog; }

    @GetMapping("/topics")
    public List<TopicResponse> topics() { return catalog.topics(); }
    @GetMapping("/topics/{slug}")
    public TopicResponse topic(@PathVariable String slug) { return catalog.topic(slug); }
    @GetMapping("/questions")
    public PageResponse<QuestionSummary> questions(
            @RequestParam(required = false) @Size(max = 120) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") @Min(0) @Max(10000) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            Authentication authentication) {
        return catalog.questions(null, search, difficulty, page, size, currentUser(authentication));
    }
    @GetMapping("/topics/{slug}/questions")
    public PageResponse<QuestionSummary> topicQuestions(
            @PathVariable String slug, @RequestParam(required = false) @Size(max = 120) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") @Min(0) @Max(10000) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            Authentication authentication) {
        return catalog.questions(slug, search, difficulty, page, size, currentUser(authentication));
    }
    @GetMapping("/questions/{slug}")
    public QuestionResponse question(@PathVariable String slug, Authentication authentication) {
        return catalog.question(slug, currentUser(authentication));
    }
    private UserAccount currentUser(Authentication authentication) {
        return authentication != null && authentication.getPrincipal() instanceof UserAccount user ? user : null;
    }
}
