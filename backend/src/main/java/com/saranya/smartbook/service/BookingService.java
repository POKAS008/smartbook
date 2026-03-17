package com.saranya.smartbook.service;

import com.saranya.smartbook.model.Booking;
import com.saranya.smartbook.model.Event;
import com.saranya.smartbook.model.User;
import com.saranya.smartbook.repository.BookingRepository;
import com.saranya.smartbook.repository.EventRepository;
import com.saranya.smartbook.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final EventRepository   eventRepo;
    private final UserRepository    userRepo;

    public BookingService(BookingRepository bookingRepo,
                          EventRepository eventRepo,
                          UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.eventRepo   = eventRepo;
        this.userRepo    = userRepo;
    }

    @Transactional
    public Booking createBooking(Long eventId, Long userId, int seats) {
        Event event = eventRepo.findByIdWithLock(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableSeats() < seats)
            throw new RuntimeException("Not enough seats available");

        event.setAvailableSeats(event.getAvailableSeats() - seats);
        eventRepo.save(event);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setSeatsBooked(seats);
        booking.setTotalPrice(event.getPrice()
                .multiply(new BigDecimal(seats)));
        booking.setStatus("CONFIRMED");
        booking.setBookedAt(LocalDateTime.now());

        return bookingRepo.save(booking);
    }

    // ✅ ADDED
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepo.findByUserId(userId);
    }
}