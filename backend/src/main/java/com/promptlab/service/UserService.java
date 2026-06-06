package com.promptlab.service;

import com.promptlab.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByUsername(String username);
    UserDTO createUser(UserDTO dto);
    UserDTO updateUser(Long id, UserDTO dto);
    void deleteUser(Long id);
}
