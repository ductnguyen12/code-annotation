package com.ntd.unipassau.codeannotation.repository;

public interface PatchingObjectRepository<ID> {
    void updateFieldById(String domain, ID questionId, String field, Object value);
}
