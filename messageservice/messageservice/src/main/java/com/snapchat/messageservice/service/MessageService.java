package com.snapchat.messageservice.service;

import com.snapchat.messageservice.entity.Message;
import com.snapchat.messageservice.repo.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(Long senderId, List<Long> receivers, String content, String mediaUrl, String type) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverIds(receivers);
        message.setContent(content);
        message.setMediaUrl(mediaUrl);
        message.setType(type);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getMessagesForUser(Long userId) {
        return messageRepository.findByReceiverIdsContaining(userId);
    }

    public List<Message> getMessagesSentByUser(Long userId) {
        return messageRepository.findBySenderId(userId);
    }
}

