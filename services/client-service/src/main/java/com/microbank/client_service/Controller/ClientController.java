package com.microbank.client_service.controller;

import com.microbank.client_service.RabbitMQConfig;
import com.microbank.client_service.dto.BlacklistStatusMessage;
import com.microbank.client_service.dto.RegistrationRequest;
import com.microbank.client_service.dto.UserDto;
import com.microbank.client_service.model.Client;
import com.microbank.client_service.model.User;
import com.microbank.client_service.repository.ClientRepository;
import com.microbank.client_service.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;
    private final PasswordEncoder passwordEncoder;

    public ClientController(ClientRepository clientRepository, UserRepository userRepository, RabbitTemplate rabbitTemplate, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Operation(summary = "Get a list of all registered clients")
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Operation(summary = "Toggle blacklist status of a client by ID")
    @PutMapping("/{id}/blacklist")
    public ResponseEntity<?> toggleBlacklist(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setBlacklisted(!client.isBlacklisted());
        Client updated = clientRepository.save(client);

        // Always send blacklist update event
        BlacklistStatusMessage message = new BlacklistStatusMessage(updated.getId(), updated.isBlacklisted());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BLACKLIST_EXCHANGE,
                RabbitMQConfig.BLACKLIST_ROUTING_KEY,
                message
        );

        return ResponseEntity.ok(Map.of("blacklisted", updated.isBlacklisted()));
    }


    @Operation(summary = "Register a new client with email, fullname, username, and password")
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@Valid @RequestBody RegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("errors", Map.of("email", "Email is already taken.")));
        }
        User user = new User();
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "client");

        User savedUser = userRepository.save(user);

        Client client = new Client();
        client.setBlacklisted(request.isBlacklisted());
        client.setUser(savedUser);
        clientRepository.save(client);

        return ResponseEntity.ok(Map.of("message", "Registration successful, you can login to transact!"));
    }


    @Operation(summary = "Get client details by email address (username)")
    @GetMapping("/by-email")
    public ResponseEntity<UserDto> getClientByEmail(@RequestParam String email) {
        User user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        UserDto dto = new UserDto(user.getId(),user.getEmail(), user.getUsername(), client.isBlacklisted());
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get currently authenticated client details")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentClient(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found "+ username));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        UserDto dto = new UserDto(user.getId(),user.getEmail(), user.getUsername(), client.isBlacklisted());
        return ResponseEntity.ok(dto);
    }




}
