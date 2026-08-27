package com.cinewave.controller;

import com.cinewave.dto.AnalyticsDTO;
import com.cinewave.dto.RoutingRuleDTO;
import com.cinewave.dto.UserDTO;
import com.cinewave.entity.Role;
import com.cinewave.service.AnalyticsService;
import com.cinewave.service.RoutingService;
import com.cinewave.service.SlaService;
import com.cinewave.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administration analytics, user roles, SLA, and routing configuration")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final UserService userService;
    private final RoutingService routingService;
    private final SlaService slaService;

    public AdminController(AnalyticsService analyticsService,
                           UserService userService,
                           RoutingService routingService,
                           SlaService slaService) {
        this.analyticsService = analyticsService;
        this.userService = userService;
        this.routingService = routingService;
        this.slaService = slaService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get full administrative analytics and dashboard metrics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all registered system users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user role (CUSTOMER, STAFF, ADMIN)")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @GetMapping("/routing")
    @Operation(summary = "US-010: Get all show-type routing rules")
    public ResponseEntity<List<RoutingRuleDTO>> getRoutingRules() {
        return ResponseEntity.ok(routingService.getAllRoutingRules());
    }

    @PutMapping("/routing/{id}")
    @Operation(summary = "US-010: Update a show-type routing rule")
    public ResponseEntity<RoutingRuleDTO> updateRoutingRule(@PathVariable Long id, @RequestBody RoutingRuleDTO dto) {
        return ResponseEntity.ok(routingService.updateRoutingRule(id, dto));
    }

    @GetMapping("/sla")
    @Operation(summary = "US-009: Get current SLA configuration")
    public ResponseEntity<Map<String, Object>> getSlaSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("defaultSlaMinutes", slaService.getDefaultSlaMinutes());
        settings.put("status", "ACTIVE");
        return ResponseEntity.ok(settings);
    }
}
