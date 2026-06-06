package com.promptlab.dto;

import com.promptlab.model.Prompt;
import com.promptlab.model.enums.PromptCategory;
import java.time.LocalDateTime;

public class PromptDTO {

    private Long id;
    private String title;
    private String content;
    private String description;
    private PromptCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorUsername;
    private Long authorId;
    private String workspaceName;
    private Long workspaceId;
    private int starCount;

    public PromptDTO() {

    }

    public static PromptDTO toDTO(Prompt prompt) {
        PromptDTO dto = new PromptDTO();
        dto.id = prompt.getId();
        dto.title = prompt.getTitle();
        dto.content = prompt.getContent();
        dto.description = prompt.getDescription();
        dto.category = prompt.getCategory();
        dto.createdAt = prompt.getCreatedAt();
        dto.updatedAt = prompt.getUpdatedAt();
        dto.authorUsername = prompt.getAuthor().getUsername();
        dto.authorId = prompt.getAuthor().getId();
        dto.starCount = prompt.getStarCount();

        if (prompt.getWorkspace() != null) {
            dto.workspaceName = prompt.getWorkspace().getName();
            dto.workspaceId = prompt.getWorkspace().getId();
        }

        return dto;
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
    public String getAuthorUsername() { return authorUsername; }
    public Long getAuthorId() { return authorId; }
    public String getWorkspaceName() { return workspaceName; }
    public Long getWorkspaceId() { return workspaceId; }
    public int getStarCount() { return starCount; }
}
