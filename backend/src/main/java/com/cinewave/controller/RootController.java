package com.cinewave.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Root entry point providing service discovery and status")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Root service discovery and health info")
    public ResponseEntity<Map<String, Object>> getRoot() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "CineWave Entertainment REST API");
        info.put("version", "1.0.0");
        info.put("status", "UP");
        info.put("timestamp", LocalDateTime.now().toString());
        info.put("health", "/api/health");
        info.put("documentation", "/swagger-ui/index.html");
        info.put("frontend", "https://cinewave-frontend.onrender.com");
        return ResponseEntity.ok(info);
    }
}
