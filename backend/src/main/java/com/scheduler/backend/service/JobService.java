package com.scheduler.backend.service;

import com.scheduler.backend.model.Job;
import com.scheduler.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class JobService {
    private final JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updated) {
        Job existing = getJobById(id);
        existing.setName(updated.getName());
        existing.setPriority(updated.getPriority());
        existing.setDeadline(updated.getDeadline());
        existing.setEstimatedHours(updated.getEstimatedHours());
        existing.setStatus(updated.getStatus());
        existing.setMachine(updated.getMachine());
        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public List<Job> getJobsByStatus(Job.JobStatus status) {
        return jobRepository.findByStatus(status);
    }
    
    public List<Job> getJobsByMachineId(Long machineId) {
        return jobRepository.findByMachineId(machineId);
    }
    public Job updateJobStatus(Long id, Job.JobStatus status) {
    Job existing = getJobById(id);
    existing.setStatus(status);
    return jobRepository.save(existing);
}
    
}
