package com.snapchat.userservice.controller;

import com.snapchat.userservice.common.ApiResponse;
import com.snapchat.userservice.dto.AuthResponse;
import com.snapchat.userservice.dto.LoginRequest;
import com.snapchat.userservice.dto.RegisterRequest;
import com.snapchat.userservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>("User registered successfully", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<AuthResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>("User Login successfully", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<AuthResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}