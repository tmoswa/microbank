package com.microbank.banking_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.microbank.banking_service.enums.TransactionType;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private LocalDateTime timestamp;

    @ManyToOne
    private Account account;

}
