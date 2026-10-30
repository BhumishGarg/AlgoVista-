package com.algovista.service;

import com.algovista.dto.ApiDtos.*;
import com.algovista.entity.Question;
import com.algovista.entity.Topic;
import com.algovista.entity.UserAccount;
import com.algovista.repository.BookmarkRepository;
import com.algovista.repository.QuestionRepository;
import com.algovista.repository.TopicRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class CatalogService {
    private final TopicRepository topics;
    private final QuestionRepository questions;
    private final BookmarkRepository bookmarks;
    private final ObjectMapper objectMapper;

    public CatalogService(TopicRepository topics, QuestionRepository questions,
                          BookmarkRepository bookmarks, ObjectMapper objectMapper) {
        this.topics = topics;
        this.questions = questions;
        this.bookmarks = bookmarks;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> topics() {
        return topics.findAllByOrderByDisplayOrderAsc().stream().map(this::topicResponse).toList();
    }

    @Transactional(readOnly = true)
    public TopicResponse topic(String slug) {
        return topicResponse(findTopic(slug));
    }

    @Transactional(readOnly = true)
    public PageResponse<QuestionSummary> questions(String topicSlug, String search, String difficulty,
                                                    int page, int size, UserAccount currentUser) {
        Topic topic = topicSlug == null ? null : findTopic(topicSlug);
        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        String normalizedDifficulty = difficulty == null || difficulty.isBlank() ? null : difficulty.trim().toUpperCase();
        if (normalizedDifficulty != null && !List.of("EASY", "MEDIUM", "HARD").contains(normalizedDifficulty)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Difficulty must be EASY, MEDIUM or HARD.");
        }
        Page<Question> result = questions.browse(topic, normalizedSearch, normalizedDifficulty,
                PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title")));
        return new PageResponse<>(result.getContent().stream().map(q -> summary(q, currentUser)).toList(),
                result.getTotalElements(), result.getTotalPages(), result.getNumber(), result.getSize());
    }

    @Transactional(readOnly = true)
    public QuestionResponse question(String slug, UserAccount currentUser) {
        Question question = questions.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found."));
        boolean bookmarked = currentUser != null && bookmarks.findByUserIdAndQuestionId(currentUser.getId(), question.getId()).isPresent();
        return questionResponse(question, bookmarked);
    }

    @Transactional(readOnly = true)
    public Question requireQuestion(Long id) {
        return questions.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found."));
    }

    @Transactional(readOnly = true)
    public Topic requireTopic(String slug) { return findTopic(slug); }

    private Topic findTopic(String slug) {
        return topics.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found."));
    }

    @Transactional(readOnly = true)
    public QuestionSummary summary(Question q, UserAccount currentUser) {
        boolean saved = currentUser != null && bookmarks.findByUserIdAndQuestionId(currentUser.getId(), q.getId()).isPresent();
        return new QuestionSummary(q.getId(), q.getTitle(), q.getSlug(), q.getTopic().getId(),
                q.getTopic().getName(), q.getTopic().getSlug(), q.getLeetcodeNumber(),
                q.getDifficulty(), q.getShortDescription(), q.isVisualizationSupported(), saved);
    }

    @Transactional(readOnly = true)
    public QuestionResponse questionResponse(Question q, boolean bookmarked) {
        List<Map<String, Object>> examples = List.of();
        if (q.getExamplesJson() != null && !q.getExamplesJson().isBlank()) {
            examples = readJsonList(q.getExamplesJson(), new TypeReference<>() {},
                    "Stored question examples contain invalid JSON.");
        }
        List<ApproachResponse> approaches = List.of();
        if (q.getApproachesJson() != null && !q.getApproachesJson().isBlank()) {
            approaches = readJsonList(q.getApproachesJson(), new TypeReference<>() {},
                    "Stored question approaches contain invalid JSON.");
        }
        Topic topic = q.getTopic();
        return new QuestionResponse(q.getId(), q.getTitle(), q.getSlug(),
                new TopicLabel(topic.getId(), topic.getName(), topic.getSlug()),
                q.getLeetcodeNumber(), q.getOfficialUrl(), q.getDifficulty(), q.getShortDescription(),
                q.getStatement(), examples, q.getConstraints(), q.getInputDescription(),
                q.getOutputDescription(), q.getReferenceJavaCode(), approaches, q.getVisualizationGuide(),
                q.isVisualizationSupported(), bookmarked);
    }

    private <T> List<T> readJsonList(String value, TypeReference<List<T>> type, String errorMessage) {
        try {
            JsonNode json = objectMapper.readTree(value);
            if (json == null) throw new IllegalStateException(errorMessage);
            if (json.isTextual()) json = objectMapper.readTree(json.textValue());
            if (json == null || !json.isArray()) throw new IllegalStateException(errorMessage);
            return objectMapper.convertValue(json, type);
        } catch (JsonProcessingException | IllegalArgumentException ex) {
            throw new IllegalStateException(errorMessage, ex);
        }
    }

    private TopicResponse topicResponse(Topic topic) {
        return new TopicResponse(topic.getId(), topic.getName(), topic.getSlug(),
                topic.getDescription(), topic.getDisplayOrder(), questions.countByTopicId(topic.getId()));
    }
}
