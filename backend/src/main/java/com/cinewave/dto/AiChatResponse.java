package com.cinewave.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AiChatResponse {

    private String reply;
    private List<String> suggestions = new ArrayList<>();
    private List<Map<String, String>> actions = new ArrayList<>();
    private LocalDateTime timestamp = LocalDateTime.now();

    public AiChatResponse() {}

    public AiChatResponse(String reply) {
        this.reply = reply;
        this.timestamp = LocalDateTime.now();
    }

    public AiChatResponse(String reply, List<String> suggestions, List<Map<String, String>> actions) {
        this.reply = reply;
        this.suggestions = suggestions != null ? suggestions : new ArrayList<>();
        this.actions = actions != null ? actions : new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<Map<String, String>> getActions() { return actions; }
    public void setActions(List<Map<String, String>> actions) { this.actions = actions; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
