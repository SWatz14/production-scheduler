package com.scheduler.backend.service;

import com.scheduler.backend.model.Machine;
import com.scheduler.backend.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

// This service class provides business logic for managing machines,
//  including CRUD operations and any additional logic related to machine management. 

public class MachineService {

    private final MachineRepository machineRepository;

    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    public Machine getMachineById(Long id) {
        return machineRepository.findById(id).orElseThrow(() -> new RuntimeException("Machine not found"));
    }

    public Machine createMachine(Machine machine) {
        return machineRepository.save(machine);
    }

    public Machine updateMachine(Long id, Machine updated) {
        Machine existing = getMachineById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setStatus(updated.getStatus());
        existing.setCapacityPerHour(updated.getCapacityPerHour());
        existing.setShiftStart(updated.getShiftStart());
        existing.setShiftEnd(updated.getShiftEnd());
        return machineRepository.save(existing);
    }
        
          

    public void deleteMachine(Long id) {
        machineRepository.deleteById(id);
    }

    public List<Machine> getMachinesByStatus(Machine.MachineStatus status) {
        return machineRepository.findByStatus(status);
    }
    
}
