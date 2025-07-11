package com.microbank.banking_service.controller;

import com.microbank.banking_service.model.Account;
import com.microbank.banking_service.model.Transaction;
import com.microbank.banking_service.service.AccountService;
import com.microbank.banking_service.enums.TransactionType;
import com.microbank.banking_service.dto.TransactionRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);


    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/me")
    public Account getMyAccount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String email = user.getUsername();
        return accountService.getClientAccount(email);
    }

    @GetMapping("/me/transactions")
    public List<Transaction> getMyTransactions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String email = user.getUsername();
        return accountService.getTransactionHistory(email);
    }

    @PostMapping("/deposit")
    public Map<String, String> deposit(Authentication authentication, @RequestBody TransactionRequest request) {
        User user = (User) authentication.getPrincipal();
        String email = user.getUsername();
        accountService.performTransaction(email, request.getAmount(), TransactionType.DEPOSIT);
        return Map.of("message", "Deposit successful");
    }

    @PostMapping("/withdraw")
    public Map<String, String> withdraw(Authentication authentication, @RequestBody TransactionRequest request) {
        User user = (User) authentication.getPrincipal();
        String email = user.getUsername();
        accountService.performTransaction(email, request.getAmount(), TransactionType.WITHDRAWAL);
        return Map.of("message", "Withdrawal successful");
    }

}
