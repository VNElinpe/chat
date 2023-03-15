package org.vnelinpe.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.vnelinpe.chat.dto.ChatMessageDTO;
import org.vnelinpe.chat.dto.ChatRequestDTO;
import org.vnelinpe.chat.dto.ResponseDTO;
import org.vnelinpe.chat.service.ChatService;

import java.util.List;

/**
 * Used to handle chat requests from clients
 *
 * @author VNElinpe
 * @since 2023/3/2
 **/
@RestController
@RequestMapping("/chat")
public class ChatController {
    @Value("${chat.model}")
    private String model;
    @Autowired
    private ChatService chatService;

    /**
     * Received a chat request from the client
     * @param uid user's id
     * @param time time
     * @param messages chat message
     * @return chat response
     */
    @PostMapping
    public ResponseDTO<String> chat(@RequestParam String uid,
                                    @RequestParam String time,
                                    @RequestBody List<ChatMessageDTO> messages) {
        ChatRequestDTO requestDTO = new ChatRequestDTO();
        requestDTO.setModel(model);
        requestDTO.setMessages(messages);
        return ResponseDTO.success(chatService.chat(uid, time, requestDTO));
    }
}
