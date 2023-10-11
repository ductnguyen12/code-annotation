package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {SolutionMapper.class})
public interface RaterMapper {

    @Mapping(target = "rates", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "solutions", ignore = true)
    Rater toRater(RaterVM rater);

    RaterVM toRaterVM(Rater rater);

    Collection<RaterVM> toRaterVMs(Collection<Rater> rater);
}
