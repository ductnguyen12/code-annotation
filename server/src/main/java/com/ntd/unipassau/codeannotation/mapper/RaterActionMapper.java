package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rater.RaterAction;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterActionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RaterActionMapper {
    @Mapping(target = "raterDataset", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    RaterAction toRaterAction(RaterActionVM actionVM);

    RaterActionVM toRaterActionVM(RaterAction action);
}
