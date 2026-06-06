package com.promptlab.web;

import com.promptlab.dto.PromptDTO;
import com.promptlab.service.PromptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @GetMapping
    public ResponseEntity<List<PromptDTO>> getAllPrompts() {
        return ResponseEntity.ok(promptService.getAllPrompts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromptDTO> getPromptById(@PathVariable Long id) {
        return ResponseEntity.ok(promptService.getPromptById(id));
    }

    @GetMapping("/by-author/{authorId}")
    public ResponseEntity<List<PromptDTO>> getPromptsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(promptService.getPromptsByAuthor(authorId));
    }

    @GetMapping("/by-workspace/{workspaceId}")
    public ResponseEntity<List<PromptDTO>> getPromptsByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(promptService.getPromptsByWorkspace(workspaceId));
    }

    @PostMapping("/author/{authorId}")
    public ResponseEntity<PromptDTO> createPrompt(@PathVariable Long authorId,
                                                  @RequestBody PromptDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promptService.createPrompt(authorId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromptDTO> updatePrompt(@PathVariable Long id,
                                                  @RequestBody PromptDTO dto) {
        return ResponseEntity.ok(promptService.updatePrompt(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        promptService.deletePrompt(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{promptId}/star/{userId}")
    public ResponseEntity<Void> starPrompt(@PathVariable Long promptId, @PathVariable Long userId) {
        promptService.starPrompt(promptId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{promptId}/star/{userId}")
    public ResponseEntity<Void> unstarPrompt(@PathVariable Long promptId, @PathVariable Long userId) {
        promptService.unstarPrompt(promptId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/starred/{userId}")
    public ResponseEntity<List<PromptDTO>> getStarredPrompts(@PathVariable Long userId) {
        return ResponseEntity.ok(promptService.getStarredPrompts(userId));
    }
}
