package com.snapchat.userservice.user.controller;


import com.traficandme.user_service_traficandme.common.ApiResponse;
import com.traficandme.user_service_traficandme.user.dto.StatusUser;
import com.traficandme.user_service_traficandme.user.dto.UserResponse;
import com.traficandme.user_service_traficandme.user.entity.UserInfo;
import com.traficandme.user_service_traficandme.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")

public class UserInfoController {
    private final UserService userService;

    public UserInfoController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("getUser/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable("userId") Integer userId){
        var user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PatchMapping("update-status")
    public ResponseEntity<ApiResponse<UserInfo>> changeStatus(
            @RequestBody StatusUser status) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse userConnected = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(userConnected.username() == null){
                throw new IllegalArgumentException("User undefined");
            }


            UserInfo updated = userService.changeStatusUser(status,userConnected);
            return ResponseEntity.ok(new ApiResponse<>("Status changed", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/info")
    public Map<String, Object> userInfo(OAuth2AuthenticationToken authentication) {
        // Return the user's attributes as a map
        return authentication.getPrincipal().getAttributes();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getUSerConnected() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse response = userService.getUserByEmail(((UserDetails) principal).getUsername());
            ApiResponse<UserResponse> apiResponse = new ApiResponse<>("User", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<UserResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
