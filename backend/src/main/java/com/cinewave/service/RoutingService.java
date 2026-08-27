package com.cinewave.service;

import com.cinewave.dto.RoutingRuleDTO;
import com.cinewave.entity.RoutingRule;
import com.cinewave.entity.ShowType;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.RoutingRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoutingService {

    private final RoutingRuleRepository routingRuleRepository;

    public RoutingService(RoutingRuleRepository routingRuleRepository) {
        this.routingRuleRepository = routingRuleRepository;
    }

    @Transactional(readOnly = true)
    public String determineTeamForShowType(ShowType showType) {
        if (showType == null) return "General Booking Team";

        String typeKey = showType.name();
        Optional<RoutingRule> ruleOpt = routingRuleRepository.findByShowType(typeKey);
        if (ruleOpt.isPresent() && Boolean.TRUE.equals(ruleOpt.get().getActive())) {
            return ruleOpt.get().getTeamName();
        }

        // Fallback default routing
        return switch (showType) {
            case IMAX -> "IMAX Booking Team";
            case PREMIUM -> "Premium Booking Team";
            case THREE_D -> "3D Booking Team";
            case SPECIAL_EVENT -> "Special Events Team";
            default -> "General Booking Team";
        };
    }

    @Transactional(readOnly = true)
    public List<RoutingRuleDTO> getAllRoutingRules() {
        return routingRuleRepository.findAll().stream()
                .map(EntityDtoMapper::toRoutingRuleDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoutingRuleDTO updateRoutingRule(Long id, RoutingRuleDTO dto) {
        RoutingRule rule = routingRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Routing rule not found with id: " + id));

        if (dto.getTeamName() != null) rule.setTeamName(dto.getTeamName());
        if (dto.getActive() != null) rule.setActive(dto.getActive());

        RoutingRule saved = routingRuleRepository.save(rule);
        return EntityDtoMapper.toRoutingRuleDTO(saved);
    }
}
