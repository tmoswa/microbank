package com.microbank.banking_service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import com.microbank.banking_service.service.AccountService;

@Component
public class BlacklistListener {
    private final AccountService accountService;

    public BlacklistListener(AccountService accountService) {
        this.accountService = accountService;
    }

    @RabbitListener(queues = "blacklist-queue")
    public void handleBlacklistEvent(Long clientId) {
        accountService.blacklistClient(clientId);
        System.out.println("Blacklisted client ID: " + clientId);
    }
}
