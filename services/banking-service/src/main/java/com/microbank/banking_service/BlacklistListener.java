package com.microbank.banking_service;

import com.microbank.banking_service.dto.BlacklistStatusMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import com.microbank.banking_service.service.AccountService;

@Component
public class BlacklistListener {
    private final AccountService accountService;

    public BlacklistListener(AccountService accountService) {
        this.accountService = accountService;
    }

    @RabbitListener(queues = RabbitMQConfig.BLACKLIST_QUEUE)
    public void handleBlacklistEvent(BlacklistStatusMessage message) {
        Long clientId = message.getClientId();
        boolean isBlacklisted = message.isBlacklisted();

        if (isBlacklisted) {
            accountService.blacklistClient(clientId);
        } else {
            accountService.removeFromBlacklist(clientId);
        }

        System.out.println("Received blacklist update: clientId=" + clientId + ", blacklisted=" + isBlacklisted);
    }

}
