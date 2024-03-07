package com.ntd.unipassau.codeannotation.integration.prolific.dto;

import lombok.Data;

import java.util.Collection;

@Data
public class PageDTO<T> {
    private Collection<T> results;
}
