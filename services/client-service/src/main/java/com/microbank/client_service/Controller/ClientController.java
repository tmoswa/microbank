package com.microbank.clientservice.controller;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    @PostMapping("/register")
    public String register() {
        return "Registration endpoint";
    }
}