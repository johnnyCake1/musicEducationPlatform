package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.PurchaseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRecordRepository extends JpaRepository<PurchaseRecord, Long> {
}
