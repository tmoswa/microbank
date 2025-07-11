package com.microbank.client_service.dto;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrationRequest {

    @NotBlank(message = "Full name is required.")
    private String fullname;

    // Getters and setters
    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Username is required.")
    private String username;

    @NotBlank(message = "Password is required.")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,}$",
            message = "Password must be at least 6 characters, include a number and a special character."
    )
    private String password;

    private boolean blacklisted;
    private String role;

}
