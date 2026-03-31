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
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import javax.crypto.Mac;

@Component
@RequiredArgsConstructor

public class DataSeeder implements CommandLineRunner {
    private final MachineRepository machineRepository;
    private final JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed machines
        if (machineRepository.count() > 7) return; // Only seed if no machines exist
        
        Machine m1= machineRepository.save(new Machine(null, "Machine 1", "Type A",
            Machine.MachineStatus.RUNNING,8.0, LocalTime.of(7,0), LocalTime.of(19,0)
        ));
        Machine m2= machineRepository.save(new Machine(null, "Machine 2", "Type B",
            Machine.MachineStatus.IDLE,6.0, LocalTime.of(7,0), LocalTime.of(19,0)
        ));
        Machine m3= machineRepository.save(new Machine(null, "Machine 3", "Type A",
            Machine.MachineStatus.MAINTENANCE,8.0, LocalTime.of(7,0), LocalTime.of(19,0)
        ));
        Machine m4= machineRepository.save(new Machine(null, "Machine 4", "Type C",
            Machine.MachineStatus.RUNNING,10.0, LocalTime.of(7,0), LocalTime.of(19,0)
        ));
        Machine m5= machineRepository.save(new Machine(null, "Machine 5", "Type B",
            Machine.MachineStatus.IDLE,6.0, LocalTime.of(7,0), LocalTime.of(19,0)
        ));


        // Example of creating a job directly with a machine reference
        jobRepository.save(new Job(null,"Bracket Assembly",1, 
            LocalDateTime.now().plusDays(1),2.5,Job.JobStatus.IN_PROGRESS,m1,
            LocalDateTime.now()));
        
        jobRepository.save(new Job(null,"Gear Manufacturing",2,
            LocalDateTime.now().plusDays(2),3.0,Job.JobStatus.QUEUED,m2,
            LocalDateTime.now()));
        
        jobRepository.save(new Job(null,"Shaft Production",1,
            LocalDateTime.now().plusDays(3),4.0,Job.JobStatus.DELAYED,m3,
            LocalDateTime.now()));
        
        jobRepository.save(new Job(null,"Housing Fabrication",3,
            LocalDateTime.now().plusDays(4),5.0,Job.JobStatus.COMPLETED,m4,
            LocalDateTime.now()));

        jobRepository.save(new Job(null,"Bearing Installation",2,
            LocalDateTime.now().plusDays(5),1.5,Job.JobStatus.QUEUED,m5,
            LocalDateTime.now()));

        jobRepository.save(new Job(null,"Final Assembly",4,
            LocalDateTime.now().plusDays(6),6.0,Job.JobStatus.IN_PROGRESS,m1,
            LocalDateTime.now()));
        
        jobRepository.save(new Job(null,"Quality Inspection",1,
            LocalDateTime.now().plusDays(7),2.0,Job.JobStatus.QUEUED,m2,
            LocalDateTime.now()));      
        
        System.out.println("Data seeding completed.");
    

       
    }
    
}
