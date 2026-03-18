package com.saranya.smartbook.service;

import com.saranya.smartbook.model.Event;
import com.saranya.smartbook.repository.BookingRepository;
import com.saranya.smartbook.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepo;
    private final BookingRepository bookingRepo;

    public EventService(EventRepository eventRepo, BookingRepository bookingRepo) {
        this.eventRepo   = eventRepo;
        this.bookingRepo = bookingRepo;
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(Event event) {
        if (event.getAvailableSeats() == null) {
            event.setAvailableSeats(event.getTotalSeats());
        }
        return eventRepo.save(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        bookingRepo.deleteByEventId(id);
        eventRepo.deleteById(id);
    }
}