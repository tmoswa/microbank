package com.microbank.client_service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {
    private Long id;
    private String email;
    private String username;
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
