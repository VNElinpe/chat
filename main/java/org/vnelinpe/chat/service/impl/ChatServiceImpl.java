package org.vnelinpe.chat.service.impl;

import com.alibaba.fastjson2.JSON;
import jakarta.annotation.PostConstruct;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.vnelinpe.chat.dto.ChatMessageDTO;
import org.vnelinpe.chat.dto.ChatRequestDTO;
import org.vnelinpe.chat.service.ChatService;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.SocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;

/**
 * TODO
 *
 * @author VNElinpe
 * @since 2023/3/2
 **/
@Service
public class ChatServiceImpl implements ChatService {
    @Value("${chat.url}")
    private String url;
    @Value("${chat.timeout}")
    private int timeout;
    @Value("${chat.token}")
    private String token;
    @Value("${chat.logPath}")
    private String logPath;
    private volatile RestTemplate restTemplate;
    private volatile HttpHeaders httpHeaders;

    @PostConstruct
    private void init() {
        Path path = Paths.get(logPath);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public String chat(String uid, String time, ChatRequestDTO requestDTO) {
        List<ChatMessageDTO> messages = requestDTO.getMessages();
        Path path = Paths.get(logPath, String.format("%s.txt", uid));
        log(path, JSON.toJSONString(JSON.parseObject(JSON.toJSONString(messages.get(messages.size() - 1))).put("time", time)));
        RequestEntity requestEntity = new RequestEntity<>(requestDTO, getHttpHeaders(), HttpMethod.POST, URI.create(url));
        ResponseEntity<Map> exchange = getRestTemplate().exchange(requestEntity, Map.class);
        List<Map> choices = (List<Map>) exchange.getBody().get("choices");
        String response = (String) ((Map) choices.get(0).get("message")).get("content");
        ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
        chatMessageDTO.setRole("assist");
        chatMessageDTO.setContent(response);
        log(path, JSON.toJSONString(JSON.parseObject(JSON.toJSONString(chatMessageDTO)).put("time", time)));
        return response;
    }

    public synchronized void log(Path path, String content) {
        try {
            Files.writeString(path, String.format("%s,\n", content), StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private HttpHeaders getHttpHeaders() {
        if (httpHeaders == null) {
            synchronized (this) {
                if (httpHeaders == null) {
                    HttpHeaders headers = new HttpHeaders();
                    headers.add("Content-Type", "application/json");
                    headers.add("Authorization", token);
                    httpHeaders = headers;
                }
            }
        }
        return httpHeaders;
    }

    /**
     * 获取RestTemplate
     * @return restTemplate
     */
    private RestTemplate getRestTemplate() {
        if (restTemplate == null) {
            synchronized (this) {
                if (restTemplate == null) {
                    // 创建代理
                    SocketAddress sa = new InetSocketAddress("127.0.0.1", 10809);

                    OkHttpClient.Builder builder = new OkHttpClient.Builder();

                    Proxy proxy = new Proxy(Proxy.Type.HTTP, sa);
//                    builder.proxy(proxy);

                    OkHttpClient client = builder.build();

                    OkHttp3ClientHttpRequestFactory requestFactory = new OkHttp3ClientHttpRequestFactory(client);
                    requestFactory.setConnectTimeout(timeout);
                    requestFactory.setReadTimeout(timeout);
                    requestFactory.setWriteTimeout(timeout);

                    restTemplate = new RestTemplate(requestFactory);
                }
            }
        }
        return restTemplate;
    }
}
