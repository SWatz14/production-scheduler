package com.scheduler.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrementing primary key
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer priority;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(name = "estimated_hours", nullable = false)
    private Double estimatedHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.QUEUED;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    @Column(name = "created_at")
    private LocalDateTime createdAt= LocalDateTime.now();

    public enum JobStatus {
        QUEUED,
        IN_PROGRESS,
        COMPLETED,
        DELAYED
    }

}
