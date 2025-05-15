package com.snapchat.storyservice.repo;

import com.snapchat.storyservice.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByExpiresAtAfter(LocalDateTime now);
}
