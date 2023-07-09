package com.ntd.unipassau.codeannotation.web.rest.errors;

import lombok.Data;

public record FieldErrorVM(String objectName, String field, String message) {
    private static final long serialVersionUID = 1L;
}
