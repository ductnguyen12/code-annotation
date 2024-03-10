package com.ntd.unipassau.codeannotation.integration.prolific;

import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;
import com.ntd.unipassau.codeannotation.web.rest.vm.SubmissionVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubmissionMapper {
    @Mapping(target = "id", source = "dto.id")
    @Mapping(target = "rater.externalId", source = "dto.participantId")
    @Mapping(target = "rater.id", source = "rater.id")
    @Mapping(target = "rater.externalSystem", source = "rater.externalSystem")
    SubmissionVM toSubmissionVM(SubmissionDTO dto, Rater rater);
}
