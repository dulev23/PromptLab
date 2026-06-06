package com.promptlab.repository;

import com.promptlab.model.Prompt;
import com.promptlab.model.enums.PromptCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
    List<Prompt> findByAuthorId(Long authorId);
    List<Prompt> findByWorkspaceId(Long workspaceId);
    List<Prompt> findByCategory(PromptCategory category);
    List<Prompt> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Prompt p ORDER BY SIZE(p.starredBy) DESC LIMIT 10")
    List<Prompt> findTop10ByStarCount();
}
