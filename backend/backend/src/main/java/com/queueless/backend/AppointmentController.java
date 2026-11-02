
package com.queueless.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @PostMapping
    public Appointment bookAppointment(
            @RequestBody Map<String, String> request) {

        try {
            String service = request.get("service");
            String date = request.get("appointmentDate");
            String time = request.get("appointmentTime");

            if (service == null || service.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Please select a service");
            }

            LocalDate appointmentDate = LocalDate.parse(date);
            LocalTime appointmentTime = LocalTime.parse(time);

            if (appointmentDate.isBefore(LocalDate.now())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Cannot book an appointment in the past");
            }

            Appointment appointment = new Appointment();
            appointment.setService(service);
            appointment.setAppointmentDate(appointmentDate);
            appointment.setAppointmentTime(appointmentTime);
            appointment.setStatus("BOOKED");

            return appointmentRepository.save(appointment);

        } catch (java.time.format.DateTimeParseException | NullPointerException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid appointment date or time");
        }
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"));

        String newStatus = request.get("status");

        if (!"CONFIRMED".equals(newStatus)
                && !"CANCELLED".equals(newStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid appointment status");
        }

        if (!"BOOKED".equals(appointment.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Only booked appointments can be updated");
        }

        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

}
