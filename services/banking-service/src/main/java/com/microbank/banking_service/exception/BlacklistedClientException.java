package com.microbank.banking_service.exception;

public class BlacklistedClientException extends RuntimeException {
    public BlacklistedClientException() {
        super("Blacklisted client");
    }
}
