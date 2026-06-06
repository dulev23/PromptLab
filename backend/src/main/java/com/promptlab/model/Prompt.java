package com.promptlab.model;

import com.promptlab.model.enums.PromptCategory;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prompts")
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptCategory category = PromptCategory.GENERAL;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToMany(mappedBy = "starredPrompts")
    private List<User> starredBy = new ArrayList<>();

    public Prompt() {}

    public Prompt(String title, String content, String description, PromptCategory category, User author, Workspace workspace) {
        this.title = title;
        this.content = content;
        this.description = description;
        this.category = category;
        this.author = author;
        this.workspace = workspace;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public PromptCategory getCategory() { return category; }
    public void setCategory(PromptCategory category) { this.category = category; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }
    public List<User> getStarredBy() { return starredBy; }
    public int getStarCount() { return starredBy.size(); }
}
