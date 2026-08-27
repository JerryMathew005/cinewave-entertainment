package com.cinewave.entity;

public enum ShowType {
    REGULAR,
    PREMIUM,
    IMAX,
    THREE_D("3D"),
    SPECIAL_EVENT;

    private final String displayName;

    ShowType() {
        this.displayName = this.name();
    }

    ShowType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ShowType fromString(String text) {
        if (text == null) return REGULAR;
        String clean = text.trim().toUpperCase();
        if (clean.equals("3D") || clean.equals("THREE_D")) return THREE_D;
        for (ShowType b : ShowType.values()) {
            if (b.name().equalsIgnoreCase(clean)) {
                return b;
            }
        }
        return REGULAR;
    }
}
