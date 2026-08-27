package com.cinewave.config;

import com.cinewave.entity.Role;
import com.cinewave.entity.RoutingRule;
import com.cinewave.entity.User;
import com.cinewave.repository.RoutingRuleRepository;
import com.cinewave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoutingRuleRepository routingRuleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoutingRuleRepository routingRuleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.routingRuleRepository = routingRuleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure Admin User
        userRepository.findByEmail("admin@cinewave.com").ifPresentOrElse(
                user -> {
                    // Update password to ensure it matches development password
                    user.setPassword(passwordEncoder.encode("Admin@123"));
                    user.setRole(Role.ADMIN);
                    userRepository.save(user);
                },
                () -> {
                    User admin = new User(
                            "System Administrator",
                            "admin@cinewave.com",
                            passwordEncoder.encode("Admin@123"),
                            "+1 (555) 019-2831",
                            Role.ADMIN
                    );
                    userRepository.save(admin);
                }
        );

        // 2. Ensure Staff User
        userRepository.findByEmail("staff@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode("Staff@123"));
                    user.setRole(Role.STAFF);
                    userRepository.save(user);
                },
                () -> {
                    User staff = new User(
                            "Operations Staff",
                            "staff@cinewave.com",
                            passwordEncoder.encode("Staff@123"),
                            "+1 (555) 019-2832",
                            Role.STAFF
                    );
                    userRepository.save(staff);
                }
        );

        // 3. Ensure Customer User
        userRepository.findByEmail("customer@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode("Customer@123"));
                    user.setRole(Role.CUSTOMER);
                    userRepository.save(user);
                },
                () -> {
                    User customer = new User(
                            "Jerry Customer",
                            "customer@cinewave.com",
                            passwordEncoder.encode("Customer@123"),
                            "+1 (555) 019-2833",
                            Role.CUSTOMER
                    );
                    userRepository.save(customer);
                }
        );

        // 4. Ensure Default Routing Rules
        ensureRoutingRule("REGULAR", "General Booking Team");
        ensureRoutingRule("PREMIUM", "Premium Booking Team");
        ensureRoutingRule("IMAX", "IMAX Booking Team");
        ensureRoutingRule("3D", "3D Booking Team");
        ensureRoutingRule("SPECIAL_EVENT", "Special Events Team");
    }

    private void ensureRoutingRule(String showType, String teamName) {
        if (routingRuleRepository.findByShowType(showType).isEmpty()) {
            RoutingRule rule = new RoutingRule(showType, teamName, true);
            routingRuleRepository.save(rule);
        }
    }
}
