package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface DatasetMapper {
    DatasetVM toDatasetVM(Dataset dataset);
    Collection<DatasetVM> toDatasetVMs(Collection<Dataset> datasets);

    @Mapping(target = "snippets", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Dataset toDataset(DatasetVM datasetVM);
}
