package com.cinewave.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA AttributeConverter for ShowType enum.
 * Safely converts between database strings (e.g. '3D', 'THREE_D', 'IMAX')
 * and ShowType enum constants, preventing IllegalArgumentException.
 */
@Converter(autoApply = true)
public class ShowTypeConverter implements AttributeConverter<ShowType, String> {

    @Override
    public String convertToDatabaseColumn(ShowType showType) {
        if (showType == null) {
            return "REGULAR";
        }
        return showType.name();
    }

    @Override
    public ShowType convertToEntityAttribute(String dbData) {
        return ShowType.fromString(dbData);
    }
}
