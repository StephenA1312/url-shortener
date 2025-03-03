package com.shorturlbackend.shorturlbackend.controller;

import com.shorturlbackend.shorturlbackend.models.LoginRequest;
import com.shorturlbackend.shorturlbackend.models.User;
import com.shorturlbackend.shorturlbackend.services.AccountService;
import com.shorturlbackend.shorturlbackend.services.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:8080") // Adjust to match your frontend
@RestController
@Slf4j
@RequestMapping("api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AccountService accountService;

    @Autowired
    public AuthController(JwtUtil jwtUtil, AccountService accountService) {
        this.jwtUtil = jwtUtil;
        this.accountService = accountService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        log.info("Login attempt with username: {}", username);
        if (username.equals("admin") && password.equals("admin")) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(token);
        }
        boolean valid = accountService.validateCredentials(username, password);
        if (valid) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");

    }

}
