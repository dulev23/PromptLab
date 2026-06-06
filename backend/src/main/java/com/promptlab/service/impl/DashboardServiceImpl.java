package com.promptlab.service.impl;

import com.promptlab.dto.DashboardDTO;
import com.promptlab.dto.PromptDTO;
import com.promptlab.repository.PromptRepository;
import com.promptlab.repository.UserRepository;
import com.promptlab.repository.WorkspaceRepository;
import com.promptlab.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PromptRepository promptRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                WorkspaceRepository workspaceRepository,
                                PromptRepository promptRepository) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.promptRepository = promptRepository;
    }

    @Override
    public DashboardDTO getDashboard() {
        long totalUsers = userRepository.count();
        long totalWorkspaces = workspaceRepository.count();
        long totalPrompts = promptRepository.count();

        List<PromptDTO> recentPrompts = promptRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(PromptDTO::toDTO)
                .toList();

        List<PromptDTO> mostStarredPrompts = promptRepository.findTop10ByStarCount().stream()
                .map(PromptDTO::toDTO)
                .toList();

        return new DashboardDTO(totalUsers, totalWorkspaces, totalPrompts, recentPrompts, mostStarredPrompts);
    }
}
