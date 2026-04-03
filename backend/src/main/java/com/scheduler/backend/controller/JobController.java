package com.scheduler.backend.controller;

import com.scheduler.backend.model.Job;
import com.scheduler.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow requests from React frontend

// This controller class is responsible for handling HTTP requests related to jobs,
// such as creating, retrieving, updating, and deleting jobs. It uses the JobService
//  to perform business logic and interact with the database. 
// The endpoints defined in this controller 
// allow clients to manage jobs in the scheduling system, including operations like
// fetching all jobs, retrieving a specific job by ID, creating new jobs, 
//  updating existing jobs, and deleting jobs.


public class JobController {
    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updated) {
        return ResponseEntity.ok(jobService.updateJob(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Job>> getJobsByStatus(@PathVariable Job.JobStatus status) {
        return ResponseEntity.ok(jobService.getJobsByStatus(status));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<Job>> getJobsByMachineId(
        @PathVariable Long machineId){
            return ResponseEntity.ok(jobService.getJobsByMachineId(machineId));
        }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Job> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
    Job.JobStatus status = Job.JobStatus.valueOf(body.get("status"));
    return ResponseEntity.ok(jobService.updateJobStatus(id, status));
}
    

}
