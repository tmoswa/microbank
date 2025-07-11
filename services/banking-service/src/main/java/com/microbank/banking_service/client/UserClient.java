// com.microbank.banking_service.client.UserClient.java
package com.microbank.banking_service.client;

import com.microbank.banking_service.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(
        name = "client-service",
        url = "http://client-service:8080",
        path = "/api/clients",
        configuration = com.microbank.banking_service.config.FeignClientConfig.class
)
public interface UserClient {
    @GetMapping("/by-email")
    UserDto getUserByEmail(@RequestParam String email);
}

