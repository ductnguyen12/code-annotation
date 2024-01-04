package com.ntd.unipassau.codeannotation.mapper;

import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import com.ntd.unipassau.codeannotation.domain.prediction.ModelExecution;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelExecutionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.PredictedRatingVM;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ModelMapper {
    ModelVM toModelVM(Model model);

    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Model toModel(ModelVM modelVM);

    ModelExecutionVM toExecutionVM(ModelExecution execution);

    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    ModelExecution toExecution(ModelExecutionVM executionVM);

    @Mapping(target = "snippetId", source = "id.snippetId")
    @Mapping(target = "modelId", source = "id.modelId")
    PredictedRatingVM toPRatingVM(PredictedRating pRating);
}
