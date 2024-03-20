package com.ntd.unipassau.codeannotation.repository;

import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomDatasetRepository {
    Page<Long> findDatasetIdPage(DatasetVM query, Pageable pageable);
}
