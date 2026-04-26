package com.taskmanager.service;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getOrCreateDefaultUser() {
        Optional<User> defaultUser = userRepository.findByUsername("default");
        if (defaultUser.isPresent()) {
            return defaultUser.get();
        } else {
            User user = new User();
            user.setUsername("default");
            user.setPassword("defaultpassword");
            return userRepository.save(user);
        }
    }

    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null;
    }

    public User signup(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return null; // User already exists
        }
        return userRepository.save(user);
    }
}
