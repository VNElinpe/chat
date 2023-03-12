package org.vnelinpe.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
     * @param messages chat message
     * @return chat response
     */
    @PostMapping
    public ResponseDTO<String> chat(@RequestBody List<ChatMessageDTO> messages) {
        ChatRequestDTO requestDTO = new ChatRequestDTO();
        requestDTO.setModel(model);
        requestDTO.setMessages(messages);
        return ResponseDTO.success(chatService.chat(requestDTO));
    }
}
