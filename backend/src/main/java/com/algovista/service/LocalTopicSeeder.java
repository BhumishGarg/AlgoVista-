package com.algovista.service;

import com.algovista.entity.Topic;
import com.algovista.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Profile("local")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LocalTopicSeeder implements CommandLineRunner {
    private static final List<Topic> TOPICS = List.of(
            new Topic("Arrays", "arrays", "Work with ordered data and build strong problem-solving fundamentals.", 1),
            new Topic("Linked Lists", "linked-lists", "Understand nodes, pointers and flexible sequential structures.", 2),
            new Topic("Stacks", "stacks", "Explore last-in, first-out structures and their applications.", 3),
            new Topic("Queues", "queues", "Learn first-in, first-out processing and scheduling patterns.", 4),
            new Topic("Binary Trees", "binary-trees", "Navigate hierarchical data and foundational tree algorithms.", 5),
            new Topic("Heaps / Priority Queue", "heaps-priority-queue", "Organize data by priority with efficient heap operations.", 6),
            new Topic("Searching", "searching", "Choose effective strategies to find data in a collection.", 7),
            new Topic("Sorting", "sorting", "Compare approaches to ordering data and their trade-offs.", 8),
            new Topic("Graphs", "graphs", "Model relationships, networks and connected systems.", 9),
            new Topic("Dynamic Programming", "dynamic-programming", "Break complex problems into reusable subproblems.", 10));

    private final TopicRepository topics;

    public LocalTopicSeeder(TopicRepository topics) {
        this.topics = topics;
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (Topic topic : TOPICS) {
            if (topics.findBySlug(topic.getSlug()).isEmpty()) {
                topics.save(topic);
            }
        }
    }
}
