package com.algovista.repository;

import com.algovista.entity.Question;
import com.algovista.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findBySlug(String slug);
    Optional<Question> findBySlugAndTopic(String slug, Topic topic);
    Optional<Question> findBySlugOrTitle(String slug, String title);
    @Query("select q from Question q join fetch q.topic where (:topic is null or q.topic = :topic) and (:search is null or lower(q.title) like lower(concat('%', :search, '%'))) and (:difficulty is null or q.difficulty = :difficulty)")
    Page<Question> browse(@Param("topic") Topic topic, @Param("search") String search, @Param("difficulty") String difficulty, Pageable pageable);
    long countByTopicId(Long topicId);
    boolean existsBySlug(String slug);
}
