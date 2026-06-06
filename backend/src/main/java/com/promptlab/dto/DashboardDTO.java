package com.promptlab.dto;

import java.util.List;

public class DashboardDTO {

    private long totalUsers;
    private long totalWorkspaces;
    private long totalPrompts;
    private List<PromptDTO> recentPrompts;
    private List<PromptDTO> mostStarredPrompts;

    public DashboardDTO() {}

    public DashboardDTO(long totalUsers, long totalWorkspaces, long totalPrompts,
                        List<PromptDTO> recentPrompts, List<PromptDTO> mostStarredPrompts) {
        this.totalUsers = totalUsers;
        this.totalWorkspaces = totalWorkspaces;
        this.totalPrompts = totalPrompts;
        this.recentPrompts = recentPrompts;
        this.mostStarredPrompts = mostStarredPrompts;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalWorkspaces() { return totalWorkspaces; }
    public long getTotalPrompts() { return totalPrompts; }
    public List<PromptDTO> getRecentPrompts() { return recentPrompts; }
    public List<PromptDTO> getMostStarredPrompts() { return mostStarredPrompts; }
}
