package com.saranya.smartbook.controller;

import com.saranya.smartbook.model.Booking;
import com.saranya.smartbook.service.BookingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Map<String, Object> request) {
        Long eventId = Long.valueOf(request.get("eventId").toString());
        Long userId  = Long.valueOf(request.get("userId").toString());
        int  seats   = Integer.parseInt(request.get("seats").toString());
        return bookingService.createBooking(eventId, userId, seats);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }
}