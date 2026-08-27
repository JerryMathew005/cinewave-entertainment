package com.cinewave.util;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

public class BookingReferenceGenerator {

    private static final AtomicInteger sequence = new AtomicInteger(100);

    public static String generateReference() {
        int currentYear = Year.now().getValue();
        int seq = sequence.incrementAndGet();
        long timestampSuffix = System.currentTimeMillis() % 10000;
        return String.format("CW-%d-%04d%02d", currentYear, seq % 10000, timestampSuffix % 100);
    }
}
