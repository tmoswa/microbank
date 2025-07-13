package com.microbank.banking_service.dto;


import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class BlacklistStatusMessage implements Serializable {
    private Long clientId;
    private boolean blacklisted;

    public BlacklistStatusMessage() {}

    public BlacklistStatusMessage(Long clientId, boolean blacklisted) {
        this.clientId = clientId;
        this.blacklisted = blacklisted;
    }

}