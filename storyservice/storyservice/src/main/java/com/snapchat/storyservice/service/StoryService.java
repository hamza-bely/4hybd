package com.snapchat.storyservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.snapchat.storyservice.entity.Story;
import com.snapchat.storyservice.repo.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class StoryService {



    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private Cloudinary cloudinary;


    public Story uploadStory(MultipartFile file, String userId, double latitude, double longitude) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "public_id", "story_" + UUID.randomUUID()
                    ));

            String mediaUrl = (String) uploadResult.get("secure_url");
            String mediaType = (String) uploadResult.get("resource_type");

            Story story = new Story();
            story.setUserId(userId);
            story.setMediaUrl(mediaUrl);
            story.setMediaType(mediaType);
            story.setLatitude(latitude);
            story.setLongitude(longitude);
            story.setCreatedAt(LocalDateTime.now());
            story.setExpiresAt(LocalDateTime.now().plusHours(24));

            return storyRepository.save(story);
        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage());
        }
    }

    public Story updateStory(Long id, MultipartFile file, double latitude, double longitude) {
        Story existing = storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        try {
            // Upload vers Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto", // auto-détection image/vidéo
                            "public_id", "story_" + UUID.randomUUID()
                    ));

            String mediaUrl = (String) uploadResult.get("secure_url");
            String mediaType = (String) uploadResult.get("resource_type");

            // Mise à jour des champs
            existing.setMediaUrl(mediaUrl);
            existing.setMediaType(mediaType);
            existing.setLatitude(latitude);
            existing.setLongitude(longitude);
            existing.setCreatedAt(LocalDateTime.now());
            existing.setExpiresAt(LocalDateTime.now().plusHours(24));

            return storyRepository.save(existing);
        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage());
        }
    }


    public Story getStory(Long id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found"));
    }

    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }
}
