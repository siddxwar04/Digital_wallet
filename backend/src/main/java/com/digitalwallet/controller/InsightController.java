package com.digitalwallet.controller;

import com.digitalwallet.dto.CategorizeRequest;
import com.digitalwallet.dto.CategorizeResponse;
import com.digitalwallet.dto.MonthlySummaryResponse;
import com.digitalwallet.service.InsightService;
import com.digitalwallet.util.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;
    private final AuthHelper authHelper;

    public InsightController(InsightService insightService, AuthHelper authHelper) {
        this.insightService = insightService;
        this.authHelper = authHelper;
    }

    @PostMapping("/categorize")
    public ResponseEntity<CategorizeResponse> categorize(@Valid @RequestBody CategorizeRequest request) {
        return ResponseEntity.ok(insightService.categorize(request.getDescription()));
    }

    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryResponse> summary(@RequestParam String month) {
        return ResponseEntity.ok(
                insightService.getMonthlySummary(authHelper.getCurrentUser(), month)
        );
    }
}
