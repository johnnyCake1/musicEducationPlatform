package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.PurchaseRecord;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.PurchaseRecordRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PurchaseRecordService {
    PurchaseRecordRepository purchaseRecordRepository;

    public PurchaseRecordService(PurchaseRecordRepository purchaseRecordRepository) {
        this.purchaseRecordRepository = purchaseRecordRepository;
    }

    public PurchaseRecord recordCoursePurchase(User user, Course course, Double amount, Date date) {
        return purchaseRecordRepository.save(new PurchaseRecord(user, course, amount, date));
    }
}
