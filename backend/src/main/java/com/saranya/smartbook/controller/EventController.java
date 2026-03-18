package com.saranya.smartbook.controller;

import com.saranya.smartbook.model.Event;
import com.saranya.smartbook.model.User;
import com.saranya.smartbook.repository.UserRepository;
import com.saranya.smartbook.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepo;

    public EventController(EventService eventService, UserRepository userRepo) {
        this.eventService = eventService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    // ✅ TEMPORARY — remove after use!
    @GetMapping("/make-admin")
    public String makeAdmin(@RequestParam String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.ROLE_ADMIN);
        userRepo.save(user);
        return "Done! " + email + " is now ROLE_ADMIN";
    }
}