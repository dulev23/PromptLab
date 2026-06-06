package com.promptlab.service.impl;

import com.promptlab.dto.PromptDTO;
import com.promptlab.model.Prompt;
import com.promptlab.model.User;
import com.promptlab.model.Workspace;
import com.promptlab.model.exception.ResourceNotFoundException;
import com.promptlab.repository.PromptRepository;
import com.promptlab.repository.UserRepository;
import com.promptlab.repository.WorkspaceRepository;
import com.promptlab.service.PromptService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromptServiceImpl implements PromptService {

    private final PromptRepository promptRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;

    public PromptServiceImpl(PromptRepository promptRepository,
                             UserRepository userRepository,
                             WorkspaceRepository workspaceRepository) {
        this.promptRepository = promptRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public List<PromptDTO> getAllPrompts() {
        return promptRepository.findAll().stream()
                .map(PromptDTO::toDTO)
                .toList();
    }

    @Override
    public List<PromptDTO> getPromptsByAuthor(Long authorId) {
        return promptRepository.findByAuthorId(authorId).stream()
                .map(PromptDTO::toDTO)
                .toList();
    }

    @Override
    public List<PromptDTO> getPromptsByWorkspace(Long workspaceId) {
        return promptRepository.findByWorkspaceId(workspaceId).stream()
                .map(PromptDTO::toDTO)
                .toList();
    }

    @Override
    public PromptDTO getPromptById(Long id) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + id));
        return PromptDTO.toDTO(prompt);
    }

    @Override
    public PromptDTO createPrompt(Long authorId, PromptDTO dto) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));

        Workspace workspace = null;
        if (dto.getWorkspaceId() != null) {
            workspace = workspaceRepository.findById(dto.getWorkspaceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + dto.getWorkspaceId()));
        }

        Prompt prompt = new Prompt(dto.getTitle(), dto.getContent(), dto.getDescription(), dto.getCategory(), author, workspace);
        return PromptDTO.toDTO(promptRepository.save(prompt));
    }

    @Override
    public PromptDTO updatePrompt(Long id, PromptDTO dto) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + id));

        prompt.setTitle(dto.getTitle());
        prompt.setContent(dto.getContent());
        prompt.setDescription(dto.getDescription());
        prompt.setCategory(dto.getCategory());
        prompt.setUpdatedAt(LocalDateTime.now());

        if (dto.getWorkspaceId() != null) {
            Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + dto.getWorkspaceId()));
            prompt.setWorkspace(workspace);
        }

        return PromptDTO.toDTO(promptRepository.save(prompt));
    }

    @Override
    public void deletePrompt(Long id) {
        if (!promptRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prompt not found with id: " + id);
        }
        promptRepository.deleteById(id);
    }

    @Override
    public void starPrompt(Long promptId, Long userId) {
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + promptId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.getStarredPrompts().contains(prompt)) {
            user.getStarredPrompts().add(prompt);
            userRepository.save(user);
        }
    }

    @Override
    public void unstarPrompt(Long promptId, Long userId) {
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + promptId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.getStarredPrompts().remove(prompt);
        userRepository.save(user);
    }

    @Override
    public List<PromptDTO> getStarredPrompts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return user.getStarredPrompts().stream()
                .map(PromptDTO::toDTO)
                .toList();
    }
}
