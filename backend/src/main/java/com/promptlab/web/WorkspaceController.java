package com.promptlab.web;

import com.promptlab.dto.WorkspaceDTO;
import com.promptlab.service.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceDTO>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceDTO> getWorkspaceById(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
    }

    @GetMapping("/by-owner/{ownerId}")
    public ResponseEntity<List<WorkspaceDTO>> getWorkspacesByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(workspaceService.getWorkspacesByOwner(ownerId));
    }

    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<WorkspaceDTO> createWorkspace(@PathVariable Long ownerId,
                                                        @RequestBody WorkspaceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workspaceService.createWorkspace(ownerId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkspaceDTO> updateWorkspace(@PathVariable Long id,
                                                        @RequestBody WorkspaceDTO dto) {
        return ResponseEntity.ok(workspaceService.updateWorkspace(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }
}
