package com.cinewave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiChatRequest {

    @NotBlank(message = "Message must not be empty")
    @Size(max = 1000, message = "Message must be at most 1000 characters")
    private String message;

    private String context;

    public AiChatRequest() {}

    public AiChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
