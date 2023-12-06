package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.PurchaseRecord;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.PurchaseRecordRepository;
import com.zheenbek.music_learn.repository.course.CourseRepository;
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
    private final CourseRepository courseRepository;

    public PurchaseRecordService(PurchaseRecordRepository purchaseRecordRepository,
                                 UserRepository userRepository,
                                 CourseRepository courseRepository) {
        this.purchaseRecordRepository = purchaseRecordRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public PurchaseRecord recordCoursePurchase(User user, Course course, Float amount, Date date) {
        return purchaseRecordRepository.save(new PurchaseRecord(user, course, amount, date));
    }

    public List<PurchaseRecord> getPurchaseRecordHistoryForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Can't get purchase history for a user: User not found with ID: " + userId));
        return Optional.of(purchaseRecordRepository.findPurchaseRecordsByUser(user))
                .orElse(new ArrayList<>());
    }

    public List<PurchaseRecord> getPurchaseRecordHistoryForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Can't get purchase history for the course: Course not found with ID: " + courseId));
        return Optional.of(purchaseRecordRepository.findPurchaseRecordsByCourse(course))
                .orElse(new ArrayList<>());
    }

    public List<PurchaseRecord> getPurchaseRecordHistoryForSellerUser(Long sellerId) {
        userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Can't get purchase history for the seller: User not found with ID: " + sellerId));
        return Optional.of(purchaseRecordRepository.findByCourse_Author_Id(sellerId))
                .orElse(new ArrayList<>());
    }
}
