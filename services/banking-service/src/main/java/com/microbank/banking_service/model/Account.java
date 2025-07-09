package com.microbank.bankingservice.model;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Data
@Entity
public class Account {
    @Id
    private String id; // UUID
    private String clientId;
    private double balance;
}