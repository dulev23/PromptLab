package com.promptlab.service.impl;

import com.promptlab.dto.WorkspaceDTO;
import com.promptlab.model.User;
import com.promptlab.model.Workspace;
import com.promptlab.model.exception.DuplicateEntityException;
import com.promptlab.model.exception.ResourceNotFoundException;
import com.promptlab.repository.UserRepository;
import com.promptlab.repository.WorkspaceRepository;
import com.promptlab.service.WorkspaceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, UserRepository userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<WorkspaceDTO> getAllWorkspaces() {
        return workspaceRepository.findAll().stream()
                .map(WorkspaceDTO::toDTO)
                .toList();
    }

    @Override
    public List<WorkspaceDTO> getWorkspacesByOwner(Long ownerId) {
        return workspaceRepository.findByOwnerId(ownerId).stream()
                .map(WorkspaceDTO::toDTO)
                .toList();
    }

    @Override
    public WorkspaceDTO getWorkspaceById(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        return WorkspaceDTO.toDTO(workspace);
    }

    @Override
    public WorkspaceDTO createWorkspace(Long ownerId, WorkspaceDTO dto) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        if (workspaceRepository.existsByNameAndOwnerId(dto.getName(), ownerId)) {
            throw new DuplicateEntityException("You already have a workspace named: " + dto.getName());
        }

        Workspace workspace = new Workspace(dto.getName(), dto.getDescription(), dto.getVisibility(), owner);
        return WorkspaceDTO.toDTO(workspaceRepository.save(workspace));
    }

    @Override
    public WorkspaceDTO updateWorkspace(Long id, WorkspaceDTO dto) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));

        workspace.setName(dto.getName());
        workspace.setDescription(dto.getDescription());
        workspace.setVisibility(dto.getVisibility());

        return WorkspaceDTO.toDTO(workspaceRepository.save(workspace));
    }

    @Override
    public void deleteWorkspace(Long id) {
        if (!workspaceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workspace not found with id: " + id);
        }
        workspaceRepository.deleteById(id);
    }
}
