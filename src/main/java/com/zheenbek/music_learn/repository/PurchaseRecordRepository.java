package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.PurchaseRecord;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRecordRepository extends JpaRepository<PurchaseRecord, Long> {
    List<PurchaseRecord> findPurchaseRecordsByUser(User user);
    List<PurchaseRecord> findPurchaseRecordsByCourse(Course course);

    List<PurchaseRecord> findByCourse_Author_Id(Long sellerId);
}
