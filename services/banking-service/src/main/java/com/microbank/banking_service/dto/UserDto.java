package com.microbank.banking_service.dto;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private boolean blacklisted;

    public UserDto() {}

    public UserDto(Long id,String email, String username, boolean blacklisted) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.blacklisted = blacklisted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isBlacklisted() { return blacklisted; }
    public void setBlacklisted(boolean blacklisted) { this.blacklisted = blacklisted; }
}
