package com.ecommerce.eventservice.config;

import com.ecommerce.eventservice.dto.EventRequestDTO;
import com.ecommerce.eventservice.service.EventService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadTestData(EventService eventService) {
        return args -> {
            // Only insert if no events exist to avoid duplicates on restart
            if (!eventService.getAllEvents().isEmpty()) {
                return;
            }

            EventRequestDTO event1 = EventRequestDTO.builder()
                    .title("Spring Sale")
                    .description("Big discounts on selected products")
                    .location("Online Store")
                    .startDate(LocalDateTime.now().plusDays(1))
                    .endDate(LocalDateTime.now().plusDays(7))
                    .build();

            EventRequestDTO event2 = EventRequestDTO.builder()
                    .title("Black Friday")
                    .description("Exclusive Black Friday offers")
                    .location("Online Store")
                    .startDate(LocalDateTime.now().plusDays(30))
                    .endDate(LocalDateTime.now().plusDays(31))
                    .build();

            eventService.createEvent(event1);
            eventService.createEvent(event2);
        };
    }
}


