package com.ecommerce.eventservice.service;

import com.ecommerce.eventservice.dto.EventRequestDTO;
import com.ecommerce.eventservice.dto.EventResponseDTO;

import java.util.List;

public interface EventService {

    EventResponseDTO createEvent(EventRequestDTO dto);

    List<EventResponseDTO> getAllEvents();

    EventResponseDTO getEventById(Long id);

    EventResponseDTO updateEvent(Long id, EventRequestDTO dto);

    void deleteEvent(Long id);
}


