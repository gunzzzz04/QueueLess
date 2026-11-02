
package com.queueless.backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueTokenRepository
        extends JpaRepository<QueueToken, Long> {

    long countByStatus(String status);

    long countByStatusAndIdLessThan(
            String status,
            Long id);
}
