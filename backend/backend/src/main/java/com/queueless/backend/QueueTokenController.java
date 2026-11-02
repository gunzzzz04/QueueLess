
package com.queueless.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class QueueTokenController {

    private final QueueTokenRepository tokenRepository;

    public QueueTokenController(QueueTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @PostMapping
    public QueueToken generateToken(@RequestBody Map<String, String> request) {

        String service = request.get("service");

        if (service == null || service.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Please select a service");
        }

        QueueToken token = new QueueToken();
        token.setService(service);
        token.setStatus("WAITING");

        return tokenRepository.save(token);
    }

    @GetMapping
    public List<QueueToken> getAllTokens() {
        return tokenRepository.findAll();
    }

    @GetMapping("/waiting-count")
    public Map<String, Long> getWaitingCount() {
        long count = tokenRepository.countByStatus("WAITING");
        return Map.of("waitingCount", count);
    }

    @GetMapping("/{id}/queue-status")
    public Map<String, Object> getQueueStatus(
            @PathVariable Long id) {

        QueueToken token = tokenRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Token not found"));

        long peopleAhead = tokenRepository.countByStatusAndIdLessThan(
                "WAITING", id);

        return Map.of(
                "tokenId", token.getId(),
                "service", token.getService(),
                "status", token.getStatus(),
                "peopleAhead", peopleAhead);
    }

    @PatchMapping("/{id}/status")
    public QueueToken updateTokenStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        QueueToken token = tokenRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Token not found"));

        String newStatus = request.get("status");

        if (newStatus == null ||
                !java.util.Set.of("WAITING", "SERVING", "COMPLETED")
                        .contains(newStatus)) {

            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Invalid token status");
        }

        String currentStatus = token.getStatus();

        boolean validTransition = ("WAITING".equals(currentStatus) &&
                "SERVING".equals(newStatus)) ||
                ("SERVING".equals(currentStatus) &&
                        "COMPLETED".equals(newStatus));

        if (!validTransition) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT,
                    "Invalid status transition");
        }

        token.setStatus(newStatus);

        return tokenRepository.save(token);
    }

}
