package com.promptlab.repository;

import com.promptlab.model.Workspace;
import com.promptlab.model.enums.WorkspaceVisibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByOwnerId(Long ownerId);
    List<Workspace> findByVisibility(WorkspaceVisibility visibility);
    boolean existsByNameAndOwnerId(String name, Long ownerId);
}
