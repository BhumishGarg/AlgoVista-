package com.algovista.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "topics")
public class Topic {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, unique = true, length = 120)
    private String slug;
    @Column(nullable = false, length = 500)
    private String description;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    protected Topic() {}
    public Topic(String name, String slug, String description, Integer displayOrder) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.displayOrder = displayOrder;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getDescription() { return description; }
    public Integer getDisplayOrder() { return displayOrder; }
}
