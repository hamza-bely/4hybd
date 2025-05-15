package com.snapchat.messageservice.controller;

import com.snapchat.messageservice.common.ApiResponse;
import com.snapchat.messageservice.dto.MessageRequest;
import com.snapchat.messageservice.entity.Message;
import com.snapchat.messageservice.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")

public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Message>> sendMessage(@RequestBody MessageRequest request) {
        try {
            Message sent = messageService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverIds(),
                    request.getContent(),
                    request.getMediaUrl(),
                    request.getType()
            );
            return ResponseEntity.ok(new ApiResponse<>("Message sent successfully", sent));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/received/{userId}")
    public ResponseEntity<ApiResponse<List<Message>>> getMessagesForUser(@PathVariable Long userId) {
        List<Message> messages = messageService.getMessagesForUser(userId);
        return ResponseEntity.ok(new ApiResponse<>("Messages retrieved", messages));
    }

    @GetMapping("/sent/{userId}")
    public ResponseEntity<ApiResponse<List<Message>>> getMessagesSentByUser(@PathVariable Long userId) {
        List<Message> messages = messageService.getMessagesSentByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>("Messages sent", messages));
    }
}
