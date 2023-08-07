package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.Rater;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RaterMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Rater toRater(RaterVM rater);
    RaterVM toRaterVM(Rater rater);
}
