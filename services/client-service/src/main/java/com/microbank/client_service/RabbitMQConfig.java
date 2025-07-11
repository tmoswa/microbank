package com.microbank.client_service;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String BLACKLIST_QUEUE = "blacklist-queue";
    public static final String BLACKLIST_EXCHANGE = "blacklist-exchange";
    public static final String BLACKLIST_ROUTING_KEY = "blacklist";

    @Bean
    public Queue blacklistQueue() {
        return new Queue(BLACKLIST_QUEUE, true); // Durable queue
    }

    @Bean
    public DirectExchange blacklistExchange() {
        return new DirectExchange(BLACKLIST_EXCHANGE);
    }

    @Bean
    public Binding blacklistBinding(Queue blacklistQueue, DirectExchange blacklistExchange) {
        return BindingBuilder.bind(blacklistQueue).to(blacklistExchange).with(BLACKLIST_ROUTING_KEY);
    }
}