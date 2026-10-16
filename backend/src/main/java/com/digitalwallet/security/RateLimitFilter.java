package com.digitalwallet.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple per-IP sliding-window limiter for auth and categorize endpoints.
 * In-memory only — suitable for local/demo single-instance use, not a distributed guarantee.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private final int authPerMinute;
    private final int categorizePerMinute;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimitFilter(int authPerMinute, int categorizePerMinute) {
        this.authPerMinute = authPerMinute;
        this.categorizePerMinute = categorizePerMinute;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !(path.startsWith("/api/auth/") || path.equals("/api/insights/categorize"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();
        int limit = path.startsWith("/api/auth/") ? authPerMinute : categorizePerMinute;
        String key = clientKey(request) + "|" + bucket(path);

        if (isLimited(key, limit)) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\":429,\"message\":\"Too many requests — try again shortly\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isLimited(String key, int limit) {
        long now = Instant.now().toEpochMilli();
        long windowStart = now - 60_000L;
        Deque<Long> timestamps = hits.computeIfAbsent(key, ignored -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= limit) {
                return true;
            }
            timestamps.addLast(now);
            return false;
        }
    }

    private static String bucket(String path) {
        if (path.startsWith("/api/auth/")) {
            return "auth";
        }
        return "categorize";
    }

    private static String clientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }
}
