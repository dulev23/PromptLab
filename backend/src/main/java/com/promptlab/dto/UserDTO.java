package com.promptlab.dto;

import com.promptlab.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private LocalDateTime createdAt;
    private int workspaceCount;
    private int promptCount;

    public UserDTO() {}

    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.avatarUrl = user.getAvatarUrl();
        dto.bio = user.getBio();
        dto.createdAt = user.getCreatedAt();
        dto.workspaceCount = user.getWorkspaces().size();
        dto.promptCount = user.getPrompts().size();
        return dto;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getWorkspaceCount() { return workspaceCount; }
    public int getPromptCount() { return promptCount; }
}
