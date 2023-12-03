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

    @GetMapping("/{userId}")
    public ResponseEntity<List<PurchaseRecord>> getPurchaseRecordHistoryForUser(@PathVariable Long userId) {
        List<PurchaseRecord> purchaseHistory = purchaseRecordService.getPurchaseRecordHistoryForUser(userId);
        return ResponseEntity.ok(purchaseHistory);
    }
}