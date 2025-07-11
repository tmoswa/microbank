package com.microbank.client_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.microbank.client_service.model.Client;
import com.microbank.client_service.model.User;
import java.util.Optional;


public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByUser(User user);
}