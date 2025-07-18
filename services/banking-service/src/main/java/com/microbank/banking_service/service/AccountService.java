package com.microbank.banking_service.service;

import com.microbank.banking_service.client.UserClient;
import com.microbank.banking_service.dto.UserDto;
import com.microbank.banking_service.enums.TransactionType;
import com.microbank.banking_service.exception.BlacklistedClientException;
import com.microbank.banking_service.exception.InsufficientBalanceException;
import com.microbank.banking_service.exception.InvalidAmountException;
import com.microbank.banking_service.model.Account;
import com.microbank.banking_service.model.Transaction;
import com.microbank.banking_service.repository.AccountRepository;
import com.microbank.banking_service.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Service
public class AccountService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final UserClient userClient;
    private final Set<Long> blacklistedClients = new HashSet<>();


    public AccountService(AccountRepository accountRepo, TransactionRepository transactionRepo, UserClient userClient) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
        this.userClient = userClient;
    }

    public void blacklistClient(Long clientId) {
        blacklistedClients.add(clientId);
    }

    public void removeFromBlacklist(Long clientId) {
        blacklistedClients.remove(clientId);
    }

    public boolean isBlacklisted(Long clientId) {
        System.out.println("Checking if client " + clientId + " is blacklisted: " + blacklistedClients.contains(clientId));
        return blacklistedClients.contains(clientId);
    }

    public Account getClientAccount(String email) {
        UserDto client = getCachedUserByEmail(email);
        Long clientId = client.getClientID();

        if (isBlacklisted(clientId)) {
            throw new BlacklistedClientException("Access denied: You are blacklisted.");
        }

        return accountRepo.findByClientId(clientId).orElseGet(() -> {
            Account newAccount = new Account();
            newAccount.setClientId(clientId);
            newAccount.setBalance(0.0);

            try {
                return accountRepo.save(newAccount);
            } catch (DataIntegrityViolationException e) {
                return accountRepo.findByClientId(clientId)
                        .orElseThrow(() -> new RuntimeException("Account creation failed and no existing account found"));
            }
        });
    }


    public List<Transaction> getTransactionHistory(String email) {
        Account account = getClientAccount(email);
        return transactionRepo.findByAccountIdOrderByTimestampDesc(account.getId());
    }

    public void performTransaction(String email, double amount, TransactionType type) {
        if (amount <= 0) throw new InvalidAmountException("Amount must be positive");

        Account account = getClientAccount(email);
        UserDto user = getCachedUserByEmail(email);

        Long clientId = user.getClientID();

        if (isBlacklisted(clientId)) {
            throw new BlacklistedClientException("Transaction blocked: you are blacklisted.");
        }


        if (type == TransactionType.WITHDRAWAL && account.getBalance() < amount) {
            throw new InsufficientBalanceException();
        }

        if (type == TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance() + amount);
        } else {
            account.setBalance(account.getBalance() - amount);
        }

        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setAmount(amount);
        tx.setType(type);
        tx.setTimestamp(LocalDateTime.now());
        transactionRepo.save(tx);
        accountRepo.save(account);
    }

    @Cacheable(value = "userCache", key = "#email")
    public UserDto getCachedUserByEmail(String email) {
        return userClient.getUserByEmail(email);
    }

    @PostConstruct
    public void preloadBlacklist() {
        try {
            List<Long> blacklisted = userClient.getBlacklistedClientIds();
            blacklistedClients.addAll(blacklisted);
        } catch (Exception e) {
            System.err.println("Failed to preload blacklist: " + e.getMessage());
        }
    }

}
