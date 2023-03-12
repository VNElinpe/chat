package org.vnelinpe.chat.dto;

import lombok.Data;

import java.util.List;

/**
 * TODO
 *
 * @author VNElinpe
 * @since 2023/3/2
 **/
@Data
public class ChatRequestDTO {
    private String model;
    private List<ChatMessageDTO> messages;
}
