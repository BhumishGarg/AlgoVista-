package com.algovista.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "questions")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 255)
    private String title;
    @Column(nullable = false, unique = true, length = 280)
    private String slug;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;
    @Column(name = "leetcode_number")
    private Integer leetcodeNumber;
    @Column(name = "official_url", length = 500)
    private String officialUrl;
    @Column(length = 20)
    private String difficulty;
    @Column(name = "short_description", length = 1000)
    private String shortDescription;
    @Column(columnDefinition = "TEXT")
    private String statement;
    @Column(name = "examples_json", columnDefinition = "json")
    private String examplesJson;
    @Column(name = "constraints_text", columnDefinition = "TEXT")
    private String constraints;
    @Column(name = "input_description", columnDefinition = "TEXT")
    private String inputDescription;
    @Column(name = "output_description", columnDefinition = "TEXT")
    private String outputDescription;
    @Column(name = "reference_java_code", columnDefinition = "MEDIUMTEXT")
    private String referenceJavaCode;
    @Column(name = "approaches_json", columnDefinition = "json")
    private String approachesJson;
    @Column(name = "visualization_guide", columnDefinition = "TEXT")
    private String visualizationGuide;
    @Column(name = "visualization_supported", nullable = false)
    private boolean visualizationSupported;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Question() {}
    public Question(String title, String slug, Topic topic) { this.title = title; this.slug = slug; this.topic = topic; }
    public void updateImportedFields(String title, Topic topic, Integer leetcodeNumber, String difficulty,
                                     String officialUrl, String shortDescription, String statement,
                                     String constraints, String examplesJson, String inputDescription,
                                     String outputDescription, String referenceJavaCode) {
        this.title = title;
        this.topic = topic;
        if (leetcodeNumber != null) this.leetcodeNumber = leetcodeNumber;
        if (difficulty != null) this.difficulty = difficulty;
        if (officialUrl != null) this.officialUrl = officialUrl;
        if (shortDescription != null) this.shortDescription = shortDescription;
        if (statement != null) this.statement = statement;
        if (constraints != null) this.constraints = constraints;
        if (examplesJson != null) this.examplesJson = examplesJson;
        if (inputDescription != null) this.inputDescription = inputDescription;
        if (outputDescription != null) this.outputDescription = outputDescription;
        if (referenceJavaCode != null) this.referenceJavaCode = referenceJavaCode;
    }
    public void updateLearningMaterial(String statement, String constraints, String inputDescription,
                                       String outputDescription, String examplesJson, String approachesJson,
                                       String visualizationGuide) {
        this.statement = statement;
        this.constraints = constraints;
        this.inputDescription = inputDescription;
        this.outputDescription = outputDescription;
        this.examplesJson = examplesJson;
        this.approachesJson = approachesJson;
        this.visualizationGuide = visualizationGuide;
        this.visualizationSupported = true;
    }
    public void updateProblemMaterial(String statement, String constraints, String inputDescription,
                                      String outputDescription, String examplesJson) {
        updateProblemMaterial(statement, constraints, inputDescription, outputDescription, examplesJson, null, true);
    }
    public void updateStackLearningMaterial(String statement, String constraints, String inputDescription,
                                            String outputDescription, String examplesJson, String approachesJson) {
        updateProblemMaterial(statement, constraints, inputDescription, outputDescription, examplesJson, approachesJson, true);
    }
    public void updateQueueLearningMaterial(String statement, String constraints, String inputDescription,
                                            String outputDescription, String examplesJson, String approachesJson) {
        updateProblemMaterial(statement, constraints, inputDescription, outputDescription, examplesJson, approachesJson, true);
    }
    private void updateProblemMaterial(String statement, String constraints, String inputDescription,
                                       String outputDescription, String examplesJson, String approachesJson,
                                       boolean visualizationSupported) {
        this.statement = statement;
        this.constraints = constraints;
        this.inputDescription = inputDescription;
        this.outputDescription = outputDescription;
        this.examplesJson = examplesJson;
        if (approachesJson != null) this.approachesJson = approachesJson;
        this.visualizationSupported = visualizationSupported;
    }
    @PrePersist void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public Topic getTopic() { return topic; }
    public Integer getLeetcodeNumber() { return leetcodeNumber; }
    public void setLeetcodeNumber(Integer value) { leetcodeNumber = value; }
    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String value) { officialUrl = value; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String value) { difficulty = value; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String value) { shortDescription = value; }
    public String getStatement() { return statement; }
    public void setStatement(String value) { statement = value; }
    public String getExamplesJson() { return examplesJson; }
    public void setExamplesJson(String value) { examplesJson = value; }
    public String getConstraints() { return constraints; }
    public void setConstraints(String value) { constraints = value; }
    public String getInputDescription() { return inputDescription; }
    public void setInputDescription(String value) { inputDescription = value; }
    public String getOutputDescription() { return outputDescription; }
    public void setOutputDescription(String value) { outputDescription = value; }
    public String getReferenceJavaCode() { return referenceJavaCode; }
    public void setReferenceJavaCode(String value) { referenceJavaCode = value; }
    public String getApproachesJson() { return approachesJson; }
    public String getVisualizationGuide() { return visualizationGuide; }
    public boolean isVisualizationSupported() { return visualizationSupported; }
}
