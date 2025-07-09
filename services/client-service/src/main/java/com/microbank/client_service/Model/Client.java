package com.microbank.clientservice.model;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Data
@Entity
public class Client {
    @Id
    private String id; // UUID
    private String email;
    private String name;
    private String password; // Hashed
    private boolean blacklisted;
}