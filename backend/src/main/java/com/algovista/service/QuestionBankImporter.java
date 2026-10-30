package com.algovista.service;

import com.algovista.dto.ApiDtos.ApproachResponse;
import com.algovista.entity.Question;
import com.algovista.entity.Topic;
import com.algovista.repository.QuestionRepository;
import com.algovista.repository.TopicRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class QuestionBankImporter implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(QuestionBankImporter.class);
    private static final Pattern SLUG = Pattern.compile("[a-z0-9]+(?:-[a-z0-9]+)*");
    private static final List<String> REQUIRED_TOPICS = List.of(
            "arrays", "linked-lists", "stacks", "queues", "binary-trees",
            "heaps-priority-queue", "searching", "sorting", "graphs", "dynamic-programming");
    private final QuestionRepository questions;
    private final TopicRepository topics;
    private final ObjectMapper mapper;

    public QuestionBankImporter(QuestionRepository questions, TopicRepository topics, ObjectMapper mapper) {
        this.questions = questions;
        this.topics = topics;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        int imported = 0, updated = 0, skipped = 0, invalid = 0;
        Set<String> seenSlugs = new HashSet<>();
        ClassPathResource resource = new ClassPathResource("data/question-bank.csv");
        if (REQUIRED_TOPICS.stream().anyMatch(slug -> topics.findBySlug(slug).isEmpty())) {
            log.warn("Question bank import skipped because one or more required topics are missing.");
            return;
        }
        try (var reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {
            for (CSVRecord row : parser) {
                try {
                    if (row.size() == 0 || row.stream().allMatch(String::isBlank)) {
                        skipped++;
                        continue;
                    }
                    String title = field(row, "title");
                    String slug = field(row, "slug");
                    String topicSlug = field(row, "topicSlug");
                    if (title == null || slug == null || topicSlug == null || !SLUG.matcher(slug).matches()) {
                        invalid++;
                        continue;
                    }
                    if (title.length() > 255 || slug.length() > 280 ||
                            lengthExceeds(field(row, "officialUrl"), 500) ||
                            lengthExceeds(field(row, "shortDescription"), 1000)) {
                        invalid++;
                        continue;
                    }
                    if (!seenSlugs.add(slug)) {
                        invalid++;
                        continue;
                    }
                    Topic topic = topics.findBySlug(topicSlug)
                            .orElseThrow(() -> new IllegalArgumentException("Unknown topic slug."));
                    Integer number = parseNumber(field(row, "leetcodeNumber"));
                    String difficulty = field(row, "difficulty");
                    if (difficulty != null) {
                        difficulty = difficulty.toUpperCase(Locale.ROOT);
                        if (!List.of("EASY", "MEDIUM", "HARD").contains(difficulty)) throw new IllegalArgumentException("Unknown difficulty.");
                    }
                    String officialUrl = field(row, "officialUrl");
                    if (officialUrl != null) validateOfficialUrl(officialUrl);
                    String examples = field(row, "examplesJson");
                    if (examples != null) mapper.readValue(examples, new TypeReference<List<Object>>() {});
                    var existing = questions.findBySlug(slug);
                    if (existing.isPresent()) {
                        Question question = existing.get();
                        question.updateImportedFields(title, topic, number, difficulty, officialUrl,
                                field(row, "shortDescription"), field(row, "statement"),
                                field(row, "constraints"), examples, field(row, "inputDescription"),
                                field(row, "outputDescription"), field(row, "referenceJavaCode"));
                        updated++;
                    } else {
                        Question question = new Question(title, slug, topic);
                        question.updateImportedFields(title, topic, number, difficulty, officialUrl,
                                field(row, "shortDescription"), field(row, "statement"),
                                field(row, "constraints"), examples, field(row, "inputDescription"),
                                field(row, "outputDescription"), field(row, "referenceJavaCode"));
                        questions.save(question);
                        imported++;
                    }
                } catch (IllegalArgumentException | com.fasterxml.jackson.core.JsonProcessingException ex) {
                    invalid++;
                    log.warn("Skipping invalid question-bank CSV row {}: {}", row.getRecordNumber(), ex.getMessage());
                }
            }
        }
        importArrayLearningMaterial();
        importLinkedListLearningMaterial();
        importStackLearningMaterial();
        importQueueLearningMaterial();
        importBinaryTreeLearningMaterial();
        importHeapLearningMaterial();
        importSearchingLearningMaterial();
        importSortingLearningMaterial();
        importGraphLearningMaterial();
        importDynamicProgrammingLearningMaterial();
        log.info("Question bank import complete: imported={}, updated={}, skipped={}, invalid={}", imported, updated, skipped, invalid);
    }

    private void importArrayLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/arrays-learning-material.json");
        List<ArrayLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Array questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (ArrayLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Array learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Array learning material references an unknown question: " + material.slug()));
            if (!"arrays".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Array learning material references a non-Array question: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Array learning material must contain 20 unique question slugs.");
        }
    }

    private void importLinkedListLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/linked-lists-learning-material.json");
        List<LinkedListLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Linked Lists questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (LinkedListLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    material.examples() == null || material.examples().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Linked Lists learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Linked Lists learning material references an unknown question: " + material.slug()));
            if (!"linked-lists".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Linked Lists learning material references a question from another topic: " + material.slug());
            }
            question.updateProblemMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()));
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Linked Lists learning material must contain 20 unique question slugs.");
        }
    }

    private void importStackLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/stacks-learning-material.json");
        List<StackLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Stack questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (StackLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    material.examples() == null || material.examples().isEmpty() ||
                    material.approaches() == null || material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Stack learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Stack learning material references an unknown question: " + material.slug()));
            if (!"stacks".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Stack learning material references a question from another topic: " + material.slug());
            }
            question.updateStackLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()));
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Stack learning material must contain 20 unique question slugs.");
        }
    }

    private void importQueueLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/queues-learning-material.json");
        List<QueueLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Queue questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (QueueLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    material.examples() == null || material.examples().isEmpty() ||
                    material.approaches() == null || material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Queue learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Queue learning material references an unknown question: " + material.slug()));
            if (!"queues".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Queue learning material references a question from another topic: " + material.slug());
            }
            question.updateQueueLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()));
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Queue learning material must contain 20 unique question slugs.");
        }
    }

    private void importBinaryTreeLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/binary-trees-learning-material.json");
        List<BinaryTreeLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Binary Tree questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (BinaryTreeLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Binary Tree learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Binary Tree learning material references an unknown question: " + material.slug()));
            if (!"binary-trees".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Binary Tree learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Binary Tree learning material must contain 20 unique question slugs.");
        }
    }

    private void importHeapLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/heaps-learning-material.json");
        List<HeapLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Heap and Priority Queue questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (HeapLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Heap learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Heap learning material references an unknown question: " + material.slug()));
            if (!"heaps-priority-queue".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Heap learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Heap learning material must contain 20 unique question slugs.");
        }
    }

    private void importSearchingLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/searching-learning-material.json");
        List<SearchingLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Searching questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (SearchingLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Searching learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Searching learning material references an unknown question: " + material.slug()));
            if (!"searching".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Searching learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Searching learning material must contain 20 unique question slugs.");
        }
    }

    private void importSortingLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/sorting-learning-material.json");
        List<SortingLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Sorting questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (SortingLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Sorting learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Sorting learning material references an unknown question: " + material.slug()));
            if (!"sorting".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Sorting learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Sorting learning material must contain 20 unique question slugs.");
        }
    }

    private void importGraphLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/graphs-learning-material.json");
        List<GraphLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) {
            throw new IllegalStateException("Expected learning material for 20 Graph questions.");
        }

        Set<String> seenSlugs = new HashSet<>();
        for (GraphLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) ||
                    isBlank(material.statement()) || isBlank(material.constraints()) ||
                    isBlank(material.inputDescription()) || isBlank(material.outputDescription()) ||
                    isBlank(material.visualizationGuide()) || material.examples() == null ||
                    material.examples().isEmpty() || material.approaches() == null ||
                    material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Graph learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug())
                    .orElseThrow(() -> new IllegalStateException("Graph learning material references an unknown question: " + material.slug()));
            if (!"graphs".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Graph learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(),
                    material.inputDescription(), material.outputDescription(),
                    mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) {
            throw new IllegalStateException("Graph learning material must contain 20 unique question slugs.");
        }
    }

    private void importDynamicProgrammingLearningMaterial() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/dynamic-programming-learning-material.json");
        List<DynamicProgrammingLearningMaterial> materials;
        try (var input = resource.getInputStream()) {
            materials = mapper.readValue(input, new TypeReference<>() {});
        }
        if (materials.size() != 20) throw new IllegalStateException("Expected learning material for 20 Dynamic Programming questions.");
        Set<String> seenSlugs = new HashSet<>();
        for (DynamicProgrammingLearningMaterial material : materials) {
            if (material.slug() == null || !seenSlugs.add(material.slug()) || isBlank(material.statement()) ||
                    isBlank(material.constraints()) || isBlank(material.inputDescription()) ||
                    isBlank(material.outputDescription()) || isBlank(material.visualizationGuide()) ||
                    material.examples() == null || material.examples().isEmpty() || material.approaches() == null || material.approaches().isEmpty()) {
                throw new IllegalStateException("Invalid or duplicate Dynamic Programming learning material for slug: " + material.slug());
            }
            Question question = questions.findBySlug(material.slug()).orElseThrow(() ->
                    new IllegalStateException("Dynamic Programming learning material references an unknown question: " + material.slug()));
            if (!"dynamic-programming".equals(question.getTopic().getSlug())) {
                throw new IllegalStateException("Dynamic Programming learning material references a question from another topic: " + material.slug());
            }
            question.updateLearningMaterial(material.statement(), material.constraints(), material.inputDescription(),
                    material.outputDescription(), mapper.writeValueAsString(material.examples()),
                    mapper.writeValueAsString(material.approaches()), material.visualizationGuide());
        }
        if (seenSlugs.size() != 20) throw new IllegalStateException("Dynamic Programming learning material must contain 20 unique question slugs.");
    }

    private static String field(CSVRecord row, String name) {
        if (!row.isMapped(name)) return null;
        String value = row.get(name);
        return value == null || value.isBlank() ? null : value.trim();
    }
    private static boolean isBlank(String value) { return value == null || value.isBlank(); }
    private static boolean lengthExceeds(String value, int limit) { return value != null && value.length() > limit; }
    private static Integer parseNumber(String value) {
        if (value == null) return null;
        try {
            int number = Integer.parseInt(value);
            if (number <= 0) throw new IllegalArgumentException("LeetCode number must be positive.");
            return number;
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("LeetCode number must be numeric.");
        }
    }
    private static void validateOfficialUrl(String value) {
        try {
            URI uri = URI.create(value);
            String host = uri.getHost();
            if (!"https".equalsIgnoreCase(uri.getScheme()) || host == null ||
                    !(host.equalsIgnoreCase("leetcode.com") || host.equalsIgnoreCase("www.leetcode.com")) ||
                    !uri.getPath().startsWith("/problems/")) {
                throw new IllegalArgumentException("Official URL must be an HTTPS LeetCode problem link.");
            }
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Official URL must be an HTTPS LeetCode problem link.");
        }
    }

    public record ArrayLearningMaterial(String slug, String statement, String constraints,
                                        String inputDescription, String outputDescription,
                                        List<Map<String, String>> examples,
                                        List<ApproachResponse> approaches,
                                        String visualizationGuide) {}
    public record LinkedListLearningMaterial(String slug, String statement, String constraints,
                                              String inputDescription, String outputDescription,
                                              List<Map<String, String>> examples) {}
    public record StackLearningMaterial(String slug, String statement, String constraints,
                                        String inputDescription, String outputDescription,
                                        List<Map<String, String>> examples,
                                        List<ApproachResponse> approaches) {}
    public record QueueLearningMaterial(String slug, String statement, String constraints,
                                        String inputDescription, String outputDescription,
                                        List<Map<String, String>> examples,
                                        List<ApproachResponse> approaches) {}
    public record BinaryTreeLearningMaterial(String slug, String statement, String constraints,
                                              String inputDescription, String outputDescription,
                                              List<Map<String, String>> examples,
                                              List<ApproachResponse> approaches,
                                              String visualizationGuide) {}
    public record HeapLearningMaterial(String slug, String statement, String constraints,
                                       String inputDescription, String outputDescription,
                                       List<Map<String, String>> examples,
                                       List<ApproachResponse> approaches,
                                       String visualizationGuide) {}
    public record SearchingLearningMaterial(String slug, String statement, String constraints,
                                             String inputDescription, String outputDescription,
                                             List<Map<String, String>> examples,
                                             List<ApproachResponse> approaches,
                                             String visualizationGuide) {}
    public record SortingLearningMaterial(String slug, String statement, String constraints,
                                           String inputDescription, String outputDescription,
                                           List<Map<String, String>> examples,
                                           List<ApproachResponse> approaches,
                                           String visualizationGuide) {}
    public record GraphLearningMaterial(String slug, String statement, String constraints,
                                        String inputDescription, String outputDescription,
                                        List<Map<String, String>> examples,
                                        List<ApproachResponse> approaches,
                                        String visualizationGuide) {}
    public record DynamicProgrammingLearningMaterial(String slug, String statement, String constraints,
                                                     String inputDescription, String outputDescription,
                                                     List<Map<String, String>> examples,
                                                     List<ApproachResponse> approaches,
                                                     String visualizationGuide) {}
}
