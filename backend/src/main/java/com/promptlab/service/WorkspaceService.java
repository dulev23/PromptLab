package com.promptlab.service;

import com.promptlab.dto.WorkspaceDTO;
import java.util.List;

public interface WorkspaceService {
    List<WorkspaceDTO> getAllWorkspaces();
    List<WorkspaceDTO> getWorkspacesByOwner(Long ownerId);
    WorkspaceDTO getWorkspaceById(Long id);
    WorkspaceDTO createWorkspace(Long ownerId, WorkspaceDTO dto);
    WorkspaceDTO updateWorkspace(Long id, WorkspaceDTO dto);
    void deleteWorkspace(Long id);
}
