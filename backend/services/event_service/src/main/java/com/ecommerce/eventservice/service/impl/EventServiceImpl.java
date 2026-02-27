package com.ecommerce.eventservice.service.impl;

import com.ecommerce.eventservice.dto.EventRequestDTO;
import com.ecommerce.eventservice.dto.EventResponseDTO;
import com.ecommerce.eventservice.entity.Event;
import com.ecommerce.eventservice.exception.ResourceNotFoundException;
import com.ecommerce.eventservice.mapper.EventMapper;
import com.ecommerce.eventservice.repository.EventRepository;
import com.ecommerce.eventservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public EventResponseDTO createEvent(EventRequestDTO dto) {
        Event event = eventMapper.toEntity(dto);
        Event saved = eventRepository.save(event);
        return eventMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(eventMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return eventMapper.toResponseDto(event);
    }

    @Override
    public EventResponseDTO updateEvent(Long id, EventRequestDTO dto) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventMapper.updateEntityFromDto(dto, existing);
        Event saved = eventRepository.save(existing);
        return eventMapper.toResponseDto(saved);
    }

    @Override
    public void deleteEvent(Long id) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventRepository.delete(existing);
    }
}


