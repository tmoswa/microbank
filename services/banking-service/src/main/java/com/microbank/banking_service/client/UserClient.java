package com.microbank.banking_service.client;

import com.microbank.banking_service.dto.UserDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "client-service",
        path = "/api/clients",
        configuration = com.microbank.banking_service.config.FeignClientConfig.class
)
@Tag(name = "UserClient", description = "Client service proxy for user operations")
public interface UserClient {
    @GetMapping("/by-email")
    UserDto getUserByEmail(@RequestParam String email);

    @GetMapping("/blacklisted-ids")
    List<Long> getBlacklistedClientIds();

}