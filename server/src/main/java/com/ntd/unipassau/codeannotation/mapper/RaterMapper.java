package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {SolutionMapper.class})
public interface RaterMapper {

    @Mapping(target = "datasets", ignore = true)
    @Mapping(target = "rates", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "solutions", ignore = true)
    Rater toRater(RaterVM rater);

    @Mapping(target = "currentDatasetId", ignore = true)
    @Mapping(target = "solutions", source = "solutions")
    @Mapping(target = ".", source = "rater")
    RaterVM toRaterVM(Rater rater, Collection<SolutionVM> solutions);

    @Mapping(target = "currentDatasetId", ignore = true)
    @Named(value = "toRaterVM")
    RaterVM toRaterVM(Rater rater);

    @Mapping(target = "currentDatasetId", ignore = true)
    @Mapping(target = "solutions", ignore = true)
    RaterVM toSimpleRaterVM(Rater rater);

    @IterableMapping(qualifiedByName = "toRaterVM")
    Collection<RaterVM> toRaterVMs(Collection<Rater> rater);
}
