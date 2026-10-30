package com.algovista.dto;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class ApiDtos {
    private ApiDtos() {}
    public record SignupRequest(@NotBlank @Size(min = 2, max = 120) String fullName,
                                @NotBlank @Email @Size(max = 254) String email,
                                @NotBlank @Size(min = 8, max = 72) String password) {}
    public record LoginRequest(@NotBlank @Email @Size(max = 254) String email,
                               @NotBlank @Size(max = 72) String password) {}
    public record ProfileUpdateRequest(@NotBlank @Size(min = 2, max = 120) String fullName) {}
    public record CommentRequest(@NotBlank @Size(max = 2000) String content) {}
    public record UserResponse(Long id, String fullName, String email, Instant createdAt,
                               long bookmarkCount, long completedCount) {}
    public record AuthResponse(UserResponse user) {}
    public record MeResponse(UserResponse user) {}
    public record TopicResponse(Long id, String name, String slug, String description,
                                Integer displayOrder, long questionCount) {}
    public record QuestionSummary(Long id, String title, String slug, Long topicId, String topicName,
                                  String topicSlug, Integer leetcodeNumber, String difficulty,
                                  String shortDescription, boolean visualizationSupported,
                                  boolean bookmarked) {}
    public record QuestionResponse(Long id, String title, String slug, TopicLabel topic,
                                   Integer leetcodeNumber, String officialUrl, String difficulty,
                                   String shortDescription, String statement,
                                   List<Map<String, Object>> examples, String constraints,
                                   String inputDescription, String outputDescription,
                                   String referenceJavaCode, List<ApproachResponse> approaches,
                                   String visualizationGuide, boolean visualizationSupported,
                                   boolean bookmarked) {}
    public record ApproachResponse(String name, List<String> steps,
                                   String timeComplexity, String spaceComplexity) {}
    public record TopicLabel(Long id, String name, String slug) {}
    public record CommentResponse(Long id, Long authorId, String authorName, String content,
                                  Instant createdAt, Instant updatedAt) {}
    public record PageResponse<T>(List<T> content, long totalElements, int totalPages, int number, int size) {}
    public record ErrorResponse(String message) {}
}
