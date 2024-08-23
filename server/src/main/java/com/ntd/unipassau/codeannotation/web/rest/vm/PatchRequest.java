package com.ntd.unipassau.codeannotation.web.rest.vm;

import lombok.Data;

@Data
public class PatchRequest {
    private String field;
    private Object value;
}
