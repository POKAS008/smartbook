package com.saranya.smartbook.controller;

import com.saranya.smartbook.model.User;
import com.saranya.smartbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Don't reveal if email exists or not for security
            return ResponseEntity.ok(Map.of("message", "If this email exists, a reset link has been sent"));
        }

        // For now store reset token in memory (simple approach)
        String resetToken = java.util.UUID.randomUUID().toString();
        User user = userOpt.get();
        user.setPassword("RESET_" + resetToken); // temporary marker
        userRepository.save(user);

        // In real app you'd send email — for now return token directly
        return ResponseEntity.ok(Map.of(
            "message", "Password reset initiated",
            "resetToken", resetToken
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token       = request.get("token");
        String newPassword = request.get("newPassword");
        String email       = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        if (!user.getPassword().equals("RESET_" + token)) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid or expired reset token"));
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}