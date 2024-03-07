package com.ntd.unipassau.codeannotation.integration.prolific.impl;

import com.ntd.unipassau.codeannotation.integration.prolific.ProlificClient;
import com.ntd.unipassau.codeannotation.integration.prolific.ProlificProps;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.PageDTO;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.Nullable;
import java.text.MessageFormat;

public class HttpProlificClient implements ProlificClient {
    public final static String PROLIFIC_API_URI = "https://api.prolific.com/api/v1/submissions/";
    public final static String API_TOKEN_TEMPLATE = "Token {0}";

    private final ProlificProps prolificProps;

    public HttpProlificClient(ProlificProps prolificProps) {
        this.prolificProps = prolificProps;
    }

    @Override
    public PageDTO<SubmissionDTO> listSubmissions(@Nullable String study) {
        return WebClient.builder()
                .baseUrl(PROLIFIC_API_URI)
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        MessageFormat.format(API_TOKEN_TEMPLATE, prolificProps.getApiKey()))
                .build()
                .get()
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<PageDTO<SubmissionDTO>>() {
                })
                .block();
    }
}
