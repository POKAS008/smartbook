package com.saranya.smartbook.repository;

import com.saranya.smartbook.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    void deleteByEventId(Long eventId);  // ✅ ADD THIS LINE
}