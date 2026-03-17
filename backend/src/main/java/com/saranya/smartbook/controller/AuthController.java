package com.saranya.smartbook.controller;

import com.saranya.smartbook.model.User;
import com.saranya.smartbook.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email    = request.get("email");
        String password = request.get("password");
        String name     = request.get("name");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already registered"));
        }

        User user = new User();
        user.setFullName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password)); // encrypted!
        user.setRole(User.Role.ROLE_USER);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email    = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() ||
            !encoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid email or password"));
        }

        User user    = userOpt.get();
        String token = UUID.randomUUID().toString();

        Map<String, Object> userDto = Map.of(
            "id",    user.getId(),
            "name",  user.getFullName() != null ? user.getFullName() : "",
            "email", user.getEmail(),
            "role",  user.getRole().toString()
        );

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user",  userDto
        ));
    }
}