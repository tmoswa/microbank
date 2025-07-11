package com.microbank.client_service.controller;

import com.microbank.client_service.RabbitMQConfig;
import com.microbank.client_service.dto.RegistrationRequest;
import com.microbank.client_service.dto.UserDto;
import com.microbank.client_service.model.Client;
import com.microbank.client_service.model.User;
import com.microbank.client_service.repository.ClientRepository;
import com.microbank.client_service.repository.UserRepository;
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

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PutMapping("/{id}/blacklist")
    public Client toggleBlacklist(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setBlacklisted(!client.isBlacklisted());
        return clientRepository.save(client);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@Valid @RequestBody RegistrationRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("errors", Map.of("username", "Username is already taken.")));
        }

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
        Client savedClient = clientRepository.save(client);

        if (savedClient.isBlacklisted()) {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.BLACKLIST_EXCHANGE,
                    RabbitMQConfig.BLACKLIST_ROUTING_KEY,
                    savedClient.getId()
            );
        }

        return ResponseEntity.ok(Map.of("message", "Registration successful, you can login to transact!"));
    }


    @GetMapping("/by-email")
    public ResponseEntity<UserDto> getClientByEmail(@RequestParam String email) {
        User user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        UserDto dto = new UserDto(user.getId(),user.getEmail(), user.getUsername(), client.isBlacklisted());
        return ResponseEntity.ok(dto);
    }

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
