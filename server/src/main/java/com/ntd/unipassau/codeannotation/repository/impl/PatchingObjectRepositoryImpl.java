package com.ntd.unipassau.codeannotation.repository.impl;

import com.ntd.unipassau.codeannotation.repository.PatchingObjectRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.text.MessageFormat;

@Repository
public class PatchingObjectRepositoryImpl<ID> implements PatchingObjectRepository<ID> {
    private final EntityManager em;

    public PatchingObjectRepositoryImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public void updateFieldById(String domain, ID id, String field, Object value) {
        if (value instanceof String)
            value = "'" + value + "'";
        em.createQuery(MessageFormat.format(
                        "UPDATE {0} SET {1} = {2} WHERE id = {3}",
                        domain, field, value, id))
                .executeUpdate();
    }
}
