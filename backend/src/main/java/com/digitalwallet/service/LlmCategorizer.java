package com.digitalwallet.service;

import com.digitalwallet.entity.InsightCategory;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class LlmCategorizer {

    private static final Logger log = LoggerFactory.getLogger(LlmCategorizer.class);

    private static final String SYSTEM_PROMPT = """
            You categorize bank transaction descriptions.
            Reply with exactly one word from this list and nothing else:
            FOOD, TRANSPORT, SHOPPING, BILLS, TRANSFERS, OTHER.
            """;

    private final String apiKey;
    private final String model;
    private final RestClient restClient;

    public LlmCategorizer(
            @Value("${app.openai.api-key:}") String apiKey,
            @Value("${app.openai.model:gpt-4o-mini}") String model,
            @Value("${app.openai.base-url:https://api.openai.com}") String baseUrl,
            @Value("${app.openai.timeout-seconds:10}") int timeoutSeconds
    ) {
        this.apiKey = apiKey;
        this.model = model;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(timeoutSeconds));
        requestFactory.setReadTimeout(Duration.ofSeconds(timeoutSeconds));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Returns null when the LLM is unavailable or the call fails, so callers can fall back
     * instead of failing the request.
     */
    public InsightCategory categorize(String description) {
        if (!isEnabled()) {
            return null;
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0,
                "max_tokens", 5,
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", description)
                )
        );

        try {
            ChatResponse response = restClient.post()
                    .uri("/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(ChatResponse.class);

            String content = extractContent(response);
            if (content == null) {
                return null;
            }
            return InsightCategory.fromLabel(content);
        } catch (Exception ex) {
            // Avoid logging full user descriptions (may contain personal details)
            log.warn("LLM categorization failed (len={}): {}",
                    description != null ? description.length() : 0,
                    ex.getMessage());
            return null;
        }
    }

    private String extractContent(ChatResponse response) {
        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            return null;
        }
        ChatResponse.Message message = response.choices().get(0).message();
        return message == null ? null : message.content();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record ChatResponse(List<Choice> choices) {

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Choice(Message message) {
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Message(String content) {
        }
    }
}
