package com.promptlab.dto;

import com.promptlab.model.Workspace;
import com.promptlab.model.enums.WorkspaceVisibility;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkspaceDTO {

    private Long id;
    private String name;
    private String description;
    private WorkspaceVisibility visibility;
    private LocalDateTime createdAt;
    private String ownerUsername;
    private Long ownerId;
    private int promptCount;

    public WorkspaceDTO() {}

    public static WorkspaceDTO toDTO(Workspace workspace) {
        WorkspaceDTO dto = new WorkspaceDTO();
        dto.id = workspace.getId();
        dto.name = workspace.getName();
        dto.description = workspace.getDescription();
        dto.visibility = workspace.getVisibility();
        dto.createdAt = workspace.getCreatedAt();
        dto.ownerUsername = workspace.getOwner().getUsername();
        dto.ownerId = workspace.getOwner().getId();
        dto.promptCount = workspace.getPrompts().size();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public WorkspaceVisibility getVisibility() { return visibility; }
    public void setVisibility(WorkspaceVisibility visibility) { this.visibility = visibility; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getOwnerUsername() { return ownerUsername; }
    public Long getOwnerId() { return ownerId; }
    public int getPromptCount() { return promptCount; }
}
