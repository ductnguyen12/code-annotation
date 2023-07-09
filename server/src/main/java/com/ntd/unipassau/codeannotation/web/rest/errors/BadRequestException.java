package com.ntd.unipassau.codeannotation.web.rest.errors;

import lombok.Getter;
import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

import java.io.Serial;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Getter
public class BadRequestException extends AbstractThrowableProblem {
    @Serial
    private static final long serialVersionUID = 1L;
    private final String entityName;
    private final String errorKey;

    public BadRequestException(String defaultMessage, String entityName, String errorKey) {
        this(null, defaultMessage, Status.BAD_REQUEST, entityName, errorKey);
    }

    public BadRequestException(URI type, String defaultMessage, Status status, String entityName, String errorKey) {
        super(type, defaultMessage, status, null, null, null, getParameters(entityName, errorKey));
        this.entityName = entityName;
        this.errorKey = errorKey;
    }

    private static Map<String, Object> getParameters(String entityName, String errorKey) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("message", "error." + errorKey);
        parameters.put("params", entityName);
        return parameters;
    }
}
