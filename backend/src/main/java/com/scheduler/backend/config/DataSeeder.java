// This class seeds the database with initial data for machines and jobs when the application starts.
// It implements CommandLineRunner, which allows it to run code after the Spring Boot application has
// started. The run method checks if there are already machines in the database, and if not, it creates
// several machines and jobs with predefined attributes. This is useful for testing and development purposes,   
// as it provides a set of sample data to work with when the application is first launched.    


package com.scheduler.backend.config;

import com.scheduler.backend.model.Job;
import com.scheduler.backend.model.Machine;
import com.scheduler.backend.repository.JobRepository;
import com.scheduler.backend.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MachineRepository machineRepository;
    private final JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        jobRepository.deleteAll();
        machineRepository.deleteAll();

        Machine m1 = machineRepository.save(new Machine(
            null, "CNC Mill #1", "CNC",
            Machine.MachineStatus.RUNNING, 8.0,
            LocalTime.of(7, 0), LocalTime.of(15, 0)));

        Machine m2 = machineRepository.save(new Machine(
            null, "Lathe #2", "Lathe",
            Machine.MachineStatus.RUNNING, 6.0,
            LocalTime.of(7, 0), LocalTime.of(15, 0)));

        Machine m3 = machineRepository.save(new Machine(
            null, "Welding Station", "Welding",
            Machine.MachineStatus.OFFLINE, 4.0,
            LocalTime.of(7, 0), LocalTime.of(15, 0)));

        Machine m4 = machineRepository.save(new Machine(
            null, "Assembly Line A", "Assembly",
            Machine.MachineStatus.RUNNING, 10.0,
            LocalTime.of(7, 0), LocalTime.of(15, 0)));

        Machine m5 = machineRepository.save(new Machine(
            null, "Paint Booth", "Painting",
            Machine.MachineStatus.IDLE, 3.0,
            LocalTime.of(7, 0), LocalTime.of(15, 0)));

        jobRepository.save(new Job(null, "Bracket Assembly", 1,
            LocalDateTime.now().plusHours(4), 2.5,
            Job.JobStatus.IN_PROGRESS, m1, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Shaft Turning", 2,
            LocalDateTime.now().plusHours(6), 3.0,
            Job.JobStatus.QUEUED, m2, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Frame Welding", 1,
            LocalDateTime.now().minusHours(2), 4.0,
            Job.JobStatus.DELAYED, m3, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Door Panel Fit", 3,
            LocalDateTime.now().plusHours(8), 1.5,
            Job.JobStatus.QUEUED, m4, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Gear Housing", 2,
            LocalDateTime.now().plusHours(5), 2.0,
            Job.JobStatus.QUEUED, m1, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Primer Coat", 3,
            LocalDateTime.now().plusHours(10), 1.0,
            Job.JobStatus.QUEUED, m5, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Shaft Collar", 2,
            LocalDateTime.now().plusHours(3), 1.5,
            Job.JobStatus.IN_PROGRESS, m2, LocalDateTime.now()));

        jobRepository.save(new Job(null, "Control Panel", 1,
            LocalDateTime.now().plusHours(7), 3.5,
            Job.JobStatus.QUEUED, m4, LocalDateTime.now()));

        System.out.println("✅ Seed data loaded!");
    }
}
