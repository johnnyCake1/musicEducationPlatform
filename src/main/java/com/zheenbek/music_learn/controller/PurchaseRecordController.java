package com.zheenbek.music_learn.controller;

import com.stripe.model.Charge;
import com.zheenbek.music_learn.entity.PurchaseRecord;
import com.zheenbek.music_learn.service.PurchaseRecordService;
import com.zheenbek.music_learn.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase-records")
public class PurchaseRecordController {
    private final PurchaseRecordService purchaseRecordService;

    PurchaseRecordController(PurchaseRecordService purchaseRecordService) {
        this.purchaseRecordService = purchaseRecordService;
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PurchaseRecord>> getPurchaseRecordHistoryForUser(@PathVariable Long buyerId) {
        List<PurchaseRecord> purchaseHistory = purchaseRecordService.getPurchaseRecordHistoryForUser(buyerId);
        return ResponseEntity.ok(purchaseHistory);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<PurchaseRecord>> getPurchaseRecordHistoryForSellerUser(@PathVariable Long sellerId) {
        List<PurchaseRecord> purchaseHistory = purchaseRecordService.getPurchaseRecordHistoryForSellerUser(sellerId);
        return ResponseEntity.ok(purchaseHistory);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<PurchaseRecord>> getPurchaseRecordHistoryCourse(@PathVariable Long courseId) {
        List<PurchaseRecord> purchaseHistory = purchaseRecordService.getPurchaseRecordHistoryForCourse(courseId);
        return ResponseEntity.ok(purchaseHistory);
    }
}