package com.microbank.banking_service.service;

import com.microbank.banking_service.client.UserClient;
import com.microbank.banking_service.dto.UserDto;
import com.microbank.banking_service.enums.TransactionType;
import com.microbank.banking_service.exception.BlacklistedClientException;
import com.microbank.banking_service.model.Account;
import com.microbank.banking_service.model.Transaction;
import com.microbank.banking_service.repository.AccountRepository;
import com.microbank.banking_service.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AccountServiceTest {

    private AccountRepository accountRepo;
    private TransactionRepository transactionRepo;
    private UserClient userClient;
    private AccountService accountService;

    @BeforeEach
    void setup() {
        accountRepo = mock(AccountRepository.class);
        transactionRepo = mock(TransactionRepository.class);
        userClient = mock(UserClient.class);
        accountService = new AccountService(accountRepo, transactionRepo, userClient);
    }

    @Test
    void testPerformDepositTransaction() {
        String email = "john@example.com";
        double depositAmount = 100.0;

        UserDto user = new UserDto(1L,"jonh@gmail.com" ,"john", false, 1L);
        Account account = new Account();
        account.setId(1L);
        account.setClientId(1L);
        account.setBalance(0.0);

        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(accountRepo.findByClientId(user.getId())).thenReturn(Optional.of(account));

        accountService.performTransaction(email, depositAmount, TransactionType.DEPOSIT);

        verify(accountRepo, times(1)).save(account);
        verify(transactionRepo, times(1)).save(any(Transaction.class));
        assertEquals(100.0, account.getBalance());
    }

    @Test
    void testWithdrawWithInsufficientFundsThrowsException() {
        String email = "jane@example.com";

        UserDto user = new UserDto(2L,"jane@gmail.com", "jane", false, 2L);
        Account account = new Account();
        account.setId(2L);
        account.setClientId(2L);
        account.setBalance(50.0);

        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(accountRepo.findByClientId(user.getId())).thenReturn(Optional.of(account));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                accountService.performTransaction(email, 100.0, TransactionType.WITHDRAWAL)
        );

        assertEquals("Insufficient balance", exception.getMessage());
    }

    @Test
    void testBlacklistedClientThrowsException() {
        String email = "evil@hacker.com";

        // User is not blacklisted via DTO anymore — just basic info
        UserDto user = new UserDto(3L, "evil@gmail.com", "evil", false, 3L);

        Account account = new Account();
        account.setId(3L);
        account.setClientId(3L);
        account.setBalance(200.0);

        when(userClient.getUserByEmail(email)).thenReturn(user);
        when(accountRepo.findByClientId(user.getId())).thenReturn(Optional.of(account));

        accountService.blacklistClient(user.getId());

        BlacklistedClientException exception = assertThrows(BlacklistedClientException.class, () ->
                accountService.performTransaction(email, 50.0, TransactionType.DEPOSIT)
        );

        assertEquals("Transaction blocked: you are blacklisted.", exception.getMessage());
    }
}
