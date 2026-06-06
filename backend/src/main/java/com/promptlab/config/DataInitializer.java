package com.promptlab.config;

import com.promptlab.model.*;
import com.promptlab.model.enums.PromptCategory;
import com.promptlab.model.enums.WorkspaceVisibility;
import com.promptlab.repository.PromptRepository;
import com.promptlab.repository.UserRepository;
import com.promptlab.repository.WorkspaceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PromptRepository promptRepository;

    public DataInitializer(UserRepository userRepository,
                           WorkspaceRepository workspaceRepository,
                           PromptRepository promptRepository) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.promptRepository = promptRepository;
    }

    @PostConstruct
    public void seed() {
        if (userRepository.count() > 0) return;

        // Users
        User bob = userRepository.save(new User("bob", "bob@example.com",
                "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg", "Prompt engineer & AI enthusiast"));
        User alice = userRepository.save(new User("alice", "alice@example.com",
                "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg", "Developer building AI tools"));

        // Workspaces
        Workspace aliceWs = workspaceRepository.save(new Workspace(
                "AI Writing", "Prompts for writing assistance", WorkspaceVisibility.PUBLIC, alice));
        Workspace bobWs = workspaceRepository.save(new Workspace(
                "Dev Tools", "Coding and debugging prompts", WorkspaceVisibility.PUBLIC, bob));

        // Prompts
        promptRepository.save(new Prompt(
                "Blog Post Writer",
                "Write a detailed blog post about {topic}. Include an introduction, 3 main sections with examples, and a conclusion. Use a friendly, informative tone.",
                "Generate full blog posts from a topic",
                PromptCategory.WRITING, alice, aliceWs));

        promptRepository.save(new Prompt(
                "Code Reviewer",
                "Review the following code for bugs, performance issues, and style improvements. Provide specific suggestions with examples:\n\n{code}",
                "Get expert-level code review feedback",
                PromptCategory.CODING, bob, bobWs));

        promptRepository.save(new Prompt(
                "Meeting Summarizer",
                "Summarize the following meeting transcript into: key decisions, action items with owners, and open questions.\n\n{transcript}",
                "Turn messy meeting notes into structured summaries",
                PromptCategory.PRODUCTIVITY, alice, aliceWs));

        promptRepository.save(new Prompt(
                "SQL Query Builder",
                "Write an optimized SQL query to {task}. Use clear aliases, proper joins, and add comments explaining the logic.",
                "Generate efficient SQL from plain English",
                PromptCategory.CODING, bob, bobWs));
    }
}
