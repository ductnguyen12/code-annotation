package com.ntd.unipassau.codeannotation.repository.impl;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.repository.CustomDatasetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.jpa.support.PageableUtils;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomDatasetRepositoryImpl implements CustomDatasetRepository {
    private final EntityManager em;

    public CustomDatasetRepositoryImpl(EntityManager em) {
        this.em = em;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Long> findDatasetIdPage(DatasetVM params, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        Long count = em.createQuery(createCountQuery(params, cb))
                .getSingleResult();

        CriteriaQuery<Long> cq = createIdQuery(params, cb);

        if (pageable.isPaged()) {
            Root<?> root = cq.getRoots().stream().findFirst().orElseThrow();
            cq.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
        }

        TypedQuery<Long> query = em.createQuery(cq);
        if (pageable.isPaged()) {
            query.setFirstResult(PageableUtils.getOffsetAsInteger(pageable));
            query.setMaxResults(pageable.getPageSize());
        }

        return PageableExecutionUtils.getPage(query.getResultList(), pageable, () -> count);
    }

    protected CriteriaQuery<Long> createIdQuery(DatasetVM params, CriteriaBuilder cb) {
        CriteriaQuery<Long> cq = createQuery(params, cb, Long.class);
        return cq.select(cq.getRoots().stream().findFirst().orElseThrow().get("id"));
    }

    protected CriteriaQuery<Long> createCountQuery(DatasetVM params, CriteriaBuilder cb) {
        CriteriaQuery<Long> cq = createQuery(params, cb, Long.class);
        return cq.select(cb.count(cq.getRoots().stream().findFirst().orElseThrow()));
    }

    protected <T> CriteriaQuery<T> createQuery(DatasetVM params, CriteriaBuilder cb, Class<T> clazz) {
        CriteriaQuery<T> cq = cb.createQuery(clazz);
        Root<Dataset> root = cq.from(Dataset.class);
        List<Predicate> predicates = createPredicates(params, cb, root);
        return cq.where(predicates.toArray(new Predicate[0]));
    }

    protected List<Predicate> createPredicates(DatasetVM params, CriteriaBuilder cb, Root<Dataset> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (params.getName() != null) {
            predicates.add(cb.like(root.get("name"), "%" + params.getName() + "%"));
        }
        if (params.getPLanguage() != null) {
            predicates.add(cb.equal(root.get("pLanguage"), params.getPLanguage()));
        }
        if (params.getArchived() != null) {
            Predicate p = cb.equal(root.get("archived"), params.getArchived());
            if (!params.getArchived())
                p = cb.or(cb.isNull(root.get("archived")), p);
            predicates.add(p);
        }

        return predicates;
    }
}
