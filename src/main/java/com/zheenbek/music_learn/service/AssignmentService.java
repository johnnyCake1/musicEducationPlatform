package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Assignment;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepo;

    public AssignmentService(AssignmentRepository assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }

    /**
     * Creates a new assignment with the given User as its assignee in the database
     * @param user an assignee of the new assignment
     * @return the assignment that was created
     */
    public Assignment save (User user) {
        Assignment assignment = new Assignment();
        assignment.setStatus("Needs to be Submitted");
        assignment.setAssignedTo(user);
        return assignmentRepo.save(assignment);
    }

    /**
     * Updates the existing assignment with the info taken from the given new assignment
     * @param assignment that the existing assignment should be updated with
     * @return the updated assignment
     */
    public Assignment save (Assignment assignment) {
        return assignmentRepo.save(assignment);
    }

    public Set<Assignment> findByUser(User user){
        return assignmentRepo.findByAssignedTo(user);
    }

    public Optional<Assignment> findById(Long assignmentId) {
        return assignmentRepo.findById(assignmentId);
    }
}
