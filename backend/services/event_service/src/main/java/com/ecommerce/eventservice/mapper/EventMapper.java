package com.ecommerce.eventservice.mapper;

import com.ecommerce.eventservice.dto.EventRequestDTO;
import com.ecommerce.eventservice.dto.EventResponseDTO;
import com.ecommerce.eventservice.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public Event toEntity(EventRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();
    }

    public void updateEntityFromDto(EventRequestDTO dto, Event event) {
        if (dto == null || event == null) {
            return;
        }
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
    }

    public EventResponseDTO toResponseDto(Event event) {
        if (event == null) {
            return null;
        }

        return EventResponseDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}


