package com.saranya.smartbook.service;

import com.saranya.smartbook.model.Event;
import com.saranya.smartbook.repository.EventRepository;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepo;

    public EventService(EventRepository eventRepo) {
        this.eventRepo = eventRepo;
    }

    // ✅ ONE-TIME FIX: runs on startup, fixes existing bad data in DB
    @PostConstruct
    public void fixAvailableSeats() {
        List<Event> events = eventRepo.findAll();
        for (Event e : events) {
            if (e.getAvailableSeats() == null || e.getAvailableSeats() > e.getTotalSeats()) {
                e.setAvailableSeats(e.getTotalSeats());
                eventRepo.save(e);
            }
        }
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(Event event) {
        // ✅ FIX: always initialize availableSeats on creation
        if (event.getAvailableSeats() == null) {
            event.setAvailableSeats(event.getTotalSeats());
        }
        return eventRepo.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepo.deleteById(id);
    }
}