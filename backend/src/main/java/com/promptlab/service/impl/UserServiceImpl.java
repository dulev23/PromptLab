package com.promptlab.service.impl;

import com.promptlab.dto.UserDTO;
import com.promptlab.model.User;
import com.promptlab.model.exception.DuplicateEntityException;
import com.promptlab.model.exception.ResourceNotFoundException;
import com.promptlab.repository.UserRepository;
import com.promptlab.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::toDTO)
                .toList();
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDTO.toDTO(user);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return UserDTO.toDTO(user);
    }

    @Override
    public UserDTO createUser(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateEntityException("Username already taken: " + dto.getUsername());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEntityException("Email already in use: " + dto.getEmail());
        }

        User user = new User(dto.getUsername(), dto.getEmail(), dto.getAvatarUrl(), dto.getBio());
        return UserDTO.toDTO(userRepository.save(user));
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setAvatarUrl(dto.getAvatarUrl());
        user.setBio(dto.getBio());

        return UserDTO.toDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
