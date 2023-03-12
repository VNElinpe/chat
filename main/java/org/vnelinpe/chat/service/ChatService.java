package org.vnelinpe.chat.service;

import org.vnelinpe.chat.dto.ChatRequestDTO;

/**
 * TODO
 *
 * @author VNElinpe
 * @since 2023/3/2
 **/
public interface ChatService {
    /**
     * 调用chatgpt
     * @param requestDTO 请求模型
     * @return 响应
     */
    String chat(ChatRequestDTO requestDTO);
}
