package com.algovista;

import com.algovista.repository.QuestionRepository;
import com.algovista.repository.TopicRepository;
import com.algovista.service.CatalogService;
import com.algovista.service.QuestionBankImporter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.TestConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Import(QuestionBankIntegrationTest.TestSeedConfiguration.class)
class QuestionBankIntegrationTest {
    @Autowired private QuestionRepository questions;
    @Autowired private TopicRepository topics;
    @Autowired private QuestionBankImporter importer;
    @Autowired private CatalogService catalog;

    @Test
    void importsQuestionBankAndStructuredLearningMaterials() throws Exception {
        assertEquals(10, topics.count());
        assertEquals(200, questions.count());
        topics.findAll().forEach(topic -> assertEquals(20, questions.countByTopicId(topic.getId()), topic.getSlug()));

        var twoSum = questions.findBySlug("arrays-two-sum").orElseThrow();
        assertEquals("Two Sum", twoSum.getTitle());
        assertEquals(1, twoSum.getLeetcodeNumber());
        assertNull(twoSum.getDifficulty());
        assertNull(twoSum.getOfficialUrl());
        assertNotNull(twoSum.getStatement());
        assertNotNull(twoSum.getConstraints());
        assertNotNull(twoSum.getInputDescription());
        assertNotNull(twoSum.getOutputDescription());
        assertTrue(twoSum.getApproachesJson().contains("Hash map"));
        assertNotNull(twoSum.getVisualizationGuide());
        assertTrue(twoSum.isVisualizationSupported());

        var twoSumResponse = catalog.question("arrays-two-sum", null);
        assertEquals(1, twoSumResponse.examples().size());
        assertEquals(2, twoSumResponse.approaches().size());
        assertEquals("O(n) average", twoSumResponse.approaches().get(1).timeComplexity());
        assertEquals(20, questions.countByTopicId(topics.findBySlug("arrays").orElseThrow().getId()));

        var addTwoNumbers = questions.findBySlug("linked-lists-add-two-numbers").orElseThrow();
        assertEquals("Add Two Numbers", addTwoNumbers.getTitle());
        assertNotNull(addTwoNumbers.getStatement());
        assertNotNull(addTwoNumbers.getConstraints());
        assertNotNull(addTwoNumbers.getInputDescription());
        assertNotNull(addTwoNumbers.getOutputDescription());
        var addTwoNumbersResponse = catalog.question("linked-lists-add-two-numbers", null);
        assertEquals(1, addTwoNumbersResponse.examples().size());
        assertEquals("7 -> 0 -> 8", addTwoNumbersResponse.examples().get(0).get("output"));

        var linkedListSlugs = java.util.List.of(
                "linked-lists-add-two-numbers",
                "linked-lists-copy-list-with-random-pointer",
                "linked-lists-delete-the-middle-node",
                "linked-lists-intersection-of-two-linked-lists",
                "linked-lists-linked-list-cycle",
                "linked-lists-linked-list-cycle-ii",
                "linked-lists-merge-k-sorted-lists",
                "linked-lists-merge-two-sorted-lists",
                "linked-lists-middle-of-the-linked-list",
                "linked-lists-odd-even-linked-list",
                "linked-lists-palindrome-linked-list",
                "linked-lists-partition-list",
                "linked-lists-remove-duplicates-from-sorted-list",
                "linked-lists-remove-duplicates-from-sorted-list-ii",
                "linked-lists-remove-nth-node-from-end",
                "linked-lists-reorder-list",
                "linked-lists-reverse-linked-list",
                "linked-lists-reverse-nodes-in-k-group",
                "linked-lists-rotate-list",
                "linked-lists-swap-nodes-in-pairs");
        for (String slug : linkedListSlugs) {
            var question = questions.findBySlug(slug).orElseThrow();
            assertNotNull(question.getStatement(), slug);
            assertNotNull(question.getConstraints(), slug);
            assertNotNull(question.getInputDescription(), slug);
            assertNotNull(question.getOutputDescription(), slug);
            assertTrue(question.isVisualizationSupported(), slug);
            assertEquals(1, catalog.question(slug, null).examples().size(), slug);
        }
        assertEquals(20, questions.countByTopicId(topics.findBySlug("linked-lists").orElseThrow().getId()));

        var baseballGame = questions.findBySlug("stacks-baseball-game").orElseThrow();
        assertNotNull(baseballGame.getStatement());
        assertNotNull(baseballGame.getConstraints());
        assertNotNull(baseballGame.getInputDescription());
        assertNotNull(baseballGame.getOutputDescription());
        assertTrue(baseballGame.getApproachesJson().contains("Stack"));
        assertTrue(baseballGame.isVisualizationSupported());
        var baseballGameResponse = catalog.question("stacks-baseball-game", null);
        assertEquals("30", baseballGameResponse.examples().get(0).get("output"));
        assertEquals(2, baseballGameResponse.approaches().size());

        var stackSlugs = java.util.List.of(
                "stacks-asteroid-collision",
                "stacks-backspace-string-compare",
                "stacks-baseball-game",
                "stacks-basic-calculator",
                "stacks-basic-calculator-ii",
                "stacks-daily-temperatures",
                "stacks-decode-string",
                "stacks-evaluate-reverse-polish-notation",
                "stacks-largest-rectangle-in-histogram",
                "stacks-make-the-string-great",
                "stacks-maximum-frequency-stack",
                "stacks-min-stack",
                "stacks-next-greater-element-i",
                "stacks-next-greater-element-ii",
                "stacks-online-stock-span",
                "stacks-remove-all-adjacent-duplicates-in-string",
                "stacks-score-of-parentheses",
                "stacks-simplify-path",
                "stacks-valid-parentheses",
                "stacks-valid-parenthesis-string");
        for (String slug : stackSlugs) {
            var question = questions.findBySlug(slug).orElseThrow();
            assertNotNull(question.getStatement(), slug);
            assertNotNull(question.getConstraints(), slug);
            assertNotNull(question.getInputDescription(), slug);
            assertNotNull(question.getOutputDescription(), slug);
            assertNotNull(question.getApproachesJson(), slug);
            assertTrue(question.isVisualizationSupported(), slug);
            var response = catalog.question(slug, null);
            assertEquals(1, response.examples().size(), slug);
            assertTrue(response.approaches().size() >= 2, slug);
        }
        assertEquals(20, questions.countByTopicId(topics.findBySlug("stacks").orElseThrow().getId()));

        var queueSlugs = java.util.List.of(
                "queues-average-of-levels-in-binary-tree",
                "queues-binary-tree-level-order-traversal",
                "queues-binary-tree-zigzag-level-order-traversal",
                "queues-design-circular-deque",
                "queues-design-circular-queue",
                "queues-dota2-senate",
                "queues-find-the-winner-of-the-circular-game",
                "queues-implement-queue-using-stacks",
                "queues-implement-stack-using-queues",
                "queues-moving-average-from-data-stream",
                "queues-number-of-recent-calls",
                "queues-number-of-students-unable-to-eat-lunch",
                "queues-open-the-lock",
                "queues-perfect-squares",
                "queues-reveal-cards-in-increasing-order",
                "queues-rotting-oranges",
                "queues-shortest-path-in-binary-matrix",
                "queues-sliding-window-maximum",
                "queues-time-needed-to-buy-tickets",
                "queues-word-ladder");
        for (String slug : queueSlugs) {
            var question = questions.findBySlug(slug).orElseThrow();
            assertNotNull(question.getStatement(), slug);
            assertNotNull(question.getConstraints(), slug);
            assertNotNull(question.getInputDescription(), slug);
            assertNotNull(question.getOutputDescription(), slug);
            assertNotNull(question.getApproachesJson(), slug);
            assertTrue(question.isVisualizationSupported(), slug);
            var response = catalog.question(slug, null);
            assertEquals(1, response.examples().size(), slug);
            assertTrue(response.approaches().size() >= 2, slug);
        }
        assertEquals(20, questions.countByTopicId(topics.findBySlug("queues").orElseThrow().getId()));

        var interviewClassic = questions.findBySlug("dynamic-programming-01-knapsack-interview-classic").orElseThrow();
        assertEquals("0/1 Knapsack – Interview Classic", interviewClassic.getTitle());
        assertNull(interviewClassic.getLeetcodeNumber());
        assertNull(interviewClassic.getStatement());
        assertNull(interviewClassic.getApproachesJson());
        assertFalse(interviewClassic.isVisualizationSupported());
    }

    @Test
    void reimportingQuestionBankDoesNotDuplicateRecords() throws Exception {
        importer.run();
        assertEquals(200, questions.count());
        topics.findAll().forEach(topic -> assertEquals(20, questions.countByTopicId(topic.getId()), topic.getSlug()));
    }

    @TestConfiguration
    static class TestSeedConfiguration {
        @Bean
        @Order(Ordered.HIGHEST_PRECEDENCE)
        CommandLineRunner seedTopics(TopicRepository topics) {
            return args -> {
                if (topics.count() != 0) return;
                topics.saveAll(java.util.List.of(
                        new com.algovista.entity.Topic("Arrays", "arrays", "Arrays.", 1),
                        new com.algovista.entity.Topic("Linked Lists", "linked-lists", "Linked lists.", 2),
                        new com.algovista.entity.Topic("Stacks", "stacks", "Stacks.", 3),
                        new com.algovista.entity.Topic("Queues", "queues", "Queues.", 4),
                        new com.algovista.entity.Topic("Binary Trees", "binary-trees", "Binary trees.", 5),
                        new com.algovista.entity.Topic("Heaps / Priority Queue", "heaps-priority-queue", "Heaps.", 6),
                        new com.algovista.entity.Topic("Searching", "searching", "Searching.", 7),
                        new com.algovista.entity.Topic("Sorting", "sorting", "Sorting.", 8),
                        new com.algovista.entity.Topic("Graphs", "graphs", "Graphs.", 9),
                        new com.algovista.entity.Topic("Dynamic Programming", "dynamic-programming", "Dynamic programming.", 10)
                ));
            };
        }
    }
}
