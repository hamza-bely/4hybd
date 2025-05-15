package com.snapchat.storyservice.config;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dvbuw88x7",
                "api_key", "682797981134444",
                "api_secret", "isnPvrMcH3Y9NLpSUm4F-IAEg2s"
        ));
    }
}
