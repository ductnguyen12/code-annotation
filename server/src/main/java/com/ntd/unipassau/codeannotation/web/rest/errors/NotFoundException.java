package com.ntd.unipassau.codeannotation.web.rest.errors;

import lombok.Getter;
import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

import java.io.Serial;
import java.net.URI;

@Getter
public class NotFoundException extends BadRequestException {
    @Serial
    private static final long serialVersionUID = 1L;

    public NotFoundException(String defaultMessage, String entityName, String errorKey) {
        this(null, defaultMessage, entityName, errorKey);
    }

    public NotFoundException(URI type, String defaultMessage, String entityName, String errorKey) {
        super(type, defaultMessage, Status.NOT_FOUND, entityName, errorKey);
    }
}
