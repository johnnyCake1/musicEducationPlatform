package com.zheenbek.music_learn.controller;

import com.stripe.model.Charge;
import com.zheenbek.music_learn.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentGatewayController {

    private final StripeService stripeService;

    PaymentGatewayController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/charge")
    public ResponseEntity<?> chargeCard(@RequestHeader(value = "token") String token, @RequestHeader(value = "amount") Double amount) {
        try {
            Charge charge = this.stripeService.chargeNewCard(token, amount);
            return ResponseEntity.ok(charge);
        } catch (Exception e) {
            e.printStackTrace(); // Or use a logger to log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error message: " + e.getMessage());
        }
    }
    @GetMapping("/charge")
    public String chargeCard2() {
       return "Hello!";
    }
}