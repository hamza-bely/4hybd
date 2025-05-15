package com.snapchat.userservice.security.controller;

import com.traficandme.user_service_traficandme.common.ApiResponse;
import com.traficandme.user_service_traficandme.security.dto.AuthenticateRequest;
import com.traficandme.user_service_traficandme.security.dto.AuthenticateResponse;
import com.traficandme.user_service_traficandme.security.dto.RegisterRequest;
import com.traficandme.user_service_traficandme.security.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService userService;

    public AuthController( AuthService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticateResponse>> register(
            @RequestBody RegisterRequest request
    ) {
        try {
            AuthenticateResponse response = userService.register(request);
            ApiResponse<AuthenticateResponse> apiResponse = new ApiResponse<>("User registered successfully", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<AuthenticateResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticateResponse>>  register(
            @RequestBody AuthenticateRequest request
    ) {
        try {
            AuthenticateResponse response = userService.authenticate(request);
            ApiResponse<AuthenticateResponse> apiResponse = new ApiResponse<>("Login successful", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<AuthenticateResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

}