package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.PurchaseRecord;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.PurchaseRecordRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseRecordService {
    private final PurchaseRecordRepository purchaseRecordRepository;
    private final UserRepository userRepository;

    public PurchaseRecordService(PurchaseRecordRepository purchaseRecordRepository, UserRepository userRepository) {
        this.purchaseRecordRepository = purchaseRecordRepository;
        this.userRepository = userRepository;
    }

    public PurchaseRecord recordCoursePurchase(User user, Course course, Float amount, Date date) {
        return purchaseRecordRepository.save(new PurchaseRecord(user, course, amount, date));
    }

    public List<PurchaseRecord> getPurchaseRecordHistoryForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Can't get purchase history: User not found with ID: " + userId));
        return Optional.of(purchaseRecordRepository.findPurchaseRecordsByUser(user))
                .orElse(new ArrayList<>());
    }
}
