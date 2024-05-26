package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.web.rest.vm.DatasetVM;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.LinkedHashMap;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface DatasetMapper {
    @Mapping(target = "demographicQuestionGroupIds", ignore = true)
    DatasetVM toDatasetVM(Dataset dataset);

    @Mapping(target = "raterDatasets", ignore = true)
    @Mapping(target = "DQuestionGroups", ignore = true)
    @Mapping(target = "snippets", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Dataset toDataset(DatasetVM datasetVM);

    @AfterMapping
    default void afterToDatasetVM(@MappingTarget DatasetVM datasetVM) {
        Map<String, Map<String, Object>> configuration = datasetVM.getConfiguration();
        if (configuration == null)
            return;
        datasetVM.setConfiguration(new LinkedHashMap<>());
        configuration.keySet().removeIf("secrets"::equalsIgnoreCase);
        for (String key : configuration.keySet()) {
            if (key.startsWith("secrets"))
                continue;
            if (configuration.get(key) == null)
                continue;
            Map<String, Object> subConfig = new LinkedHashMap<>(configuration.get(key));
            subConfig.keySet().removeIf(k -> k.startsWith("secrets"));
            datasetVM.getConfiguration().put(key, subConfig);
        }
    }
}
