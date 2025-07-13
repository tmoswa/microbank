package com.microbank.banking_service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private boolean blacklisted;
    private Long clientID;

    public UserDto() {}

    public UserDto(Long id,String email, String username, boolean blacklisted, Long clientID) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.blacklisted = blacklisted;
        this.clientID = clientID;
    }

}
