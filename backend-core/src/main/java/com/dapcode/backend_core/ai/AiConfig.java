package com.dapcode.backend_core.ai;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AiConfig {
    @Value("${ai-service.base-url:http://localhost:8000}")
    private String baseUrl;

    @Value("${ai-service.connection-timeout-ms:5000}")
    private int connectionTimeoutMs;

    @Value("${ai-service.read-timeout-ms:45000}")
    private int readTimeoutMs;

    @Bean
    public RestClient aiRestClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(Duration.ofMillis(connectionTimeoutMs));
        factory.setReadTimeout(Duration.ofMillis(readTimeoutMs));

        return RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }
}
