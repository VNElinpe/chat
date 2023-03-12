package org.vnelinpe.chat.service.impl;

import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.vnelinpe.chat.dto.ChatRequestDTO;
import org.vnelinpe.chat.service.ChatService;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.SocketAddress;
import java.net.URI;
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
    private volatile RestTemplate restTemplate;
    private volatile HttpHeaders httpHeaders;

    @Override
    public String chat(ChatRequestDTO requestDTO) {
        RequestEntity requestEntity = new RequestEntity<>(requestDTO, getHttpHeaders(), HttpMethod.POST, URI.create(url));
        ResponseEntity<Map> exchange = getRestTemplate().exchange(requestEntity, Map.class);
        List<Map> choices = (List<Map>) exchange.getBody().get("choices");
        return (String) ((Map) choices.get(0).get("message")).get("content");
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
