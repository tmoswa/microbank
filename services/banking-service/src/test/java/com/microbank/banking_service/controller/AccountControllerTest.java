package com.microbank.banking_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microbank.banking_service.client.UserClient;
import com.microbank.banking_service.dto.TransactionRequest;
import com.microbank.banking_service.dto.UserDto;
import com.microbank.banking_service.enums.TransactionType;
import com.microbank.banking_service.model.Account;
import com.microbank.banking_service.service.AccountService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    @MockBean
    private UserClient userClient;

    private final String testEmail = "test@example.com";

    private UserDto mockUser() {
        UserDto user = new UserDto();
        user.setId(1L);
        user.setEmail(testEmail);
        user.setBlacklisted(false);
        return user;
    }

    @Test
    @WithMockUser(username = testEmail)
    public void testGetMyAccount() throws Exception {
        UserDto userDto = mockUser();
        when(userClient.getUserByEmail(testEmail)).thenReturn(userDto);

        Account account = new Account();
        account.setId(1L);
        account.setClientId(1L);
        account.setBalance(500.0);

        when(accountService.getClientAccount(testEmail)).thenReturn(account);

        mockMvc.perform(get("/api/accounts/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(500.0));
    }

    @Test
    @WithMockUser(username = testEmail)
    public void testDeposit() throws Exception {
        UserDto userDto = mockUser();
        when(userClient.getUserByEmail(testEmail)).thenReturn(userDto);

        TransactionRequest request = new TransactionRequest();
        request.setAmount(100.0);

        // No need to mock return since the controller only verifies execution, not return from service
        mockMvc.perform(post("/api/accounts/deposit")
                        .contentType("application/json")
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Deposit successful"));

        verify(accountService).performTransaction(testEmail, 100.0, TransactionType.DEPOSIT);
    }

    @Test
    @WithMockUser(username = testEmail)
    public void testWithdraw() throws Exception {
        UserDto userDto = mockUser();
        when(userClient.getUserByEmail(testEmail)).thenReturn(userDto);

        TransactionRequest request = new TransactionRequest();
        request.setAmount(50.0);

        mockMvc.perform(post("/api/accounts/withdraw")
                        .contentType("application/json")
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Withdrawal successful"));

        verify(accountService).performTransaction(testEmail, 50.0, TransactionType.WITHDRAWAL);
    }
}
