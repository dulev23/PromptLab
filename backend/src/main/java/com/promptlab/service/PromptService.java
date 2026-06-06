package com.promptlab.service;

import com.promptlab.dto.PromptDTO;
import java.util.List;

public interface PromptService {
    List<PromptDTO> getAllPrompts();
    List<PromptDTO> getPromptsByAuthor(Long authorId);
    List<PromptDTO> getPromptsByWorkspace(Long workspaceId);
    PromptDTO getPromptById(Long id);
    PromptDTO createPrompt(Long authorId, PromptDTO dto);
    PromptDTO updatePrompt(Long id, PromptDTO dto);
    void deletePrompt(Long id);
    void starPrompt(Long promptId, Long userId);
    void unstarPrompt(Long promptId, Long userId);
    List<PromptDTO> getStarredPrompts(Long userId);
}
