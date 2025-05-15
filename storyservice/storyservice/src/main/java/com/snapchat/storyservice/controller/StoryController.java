package com.snapchat.storyservice.controller;

import com.snapchat.storyservice.common.ApiResponse;
import com.snapchat.storyservice.dto.StoryUploadRequest;
import com.snapchat.storyservice.entity.Story;
import com.snapchat.storyservice.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")

public class StoryController {

    @Autowired
    private StoryService storyService;

    // CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Story>> uploadStory(@ModelAttribute StoryUploadRequest request) {
        try {
            Story story = storyService.uploadStory(
                    request.getFile(),
                    request.getUserId(),
                    request.getLatitude(),
                    request.getLongitude()
            );
            return ResponseEntity.ok(new ApiResponse<>("Story uploaded successfully", story));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Story>> updateStory(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("latitude") double lat,
            @RequestParam("longitude") double lon) {
        try {
            Story updated = storyService.updateStory(id, file, lat, lon);
            return ResponseEntity.ok(new ApiResponse<>("Story updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Story>> getStory(@PathVariable Long id) {
        try {
            Story story = storyService.getStory(id);
            return ResponseEntity.ok(new ApiResponse<>("Story retrieved successfully", story));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // GET all
    @GetMapping
    public ResponseEntity<ApiResponse<List<Story>>> getAllStories() {
        List<Story> stories = storyService.getAllStories();
        return ResponseEntity.ok(new ApiResponse<>("All stories retrieved successfully", stories));
    }
}
