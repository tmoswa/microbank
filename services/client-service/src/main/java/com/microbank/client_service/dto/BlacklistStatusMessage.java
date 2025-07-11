package com.microbank.client_service.dto;


import java.io.Serializable;

import java.io.Serializable;

public class BlacklistStatusMessage implements Serializable {
    private Long clientId;
    private boolean blacklisted;

    public BlacklistStatusMessage() {}

    public BlacklistStatusMessage(Long clientId, boolean blacklisted) {
        this.clientId = clientId;
        this.blacklisted = blacklisted;
    }

    public Long getClientId() {
        return clientId;
    }

    public boolean isBlacklisted() {
        return blacklisted;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public void setBlacklisted(boolean blacklisted) {
        this.blacklisted = blacklisted;
    }
}