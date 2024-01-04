package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import com.ntd.unipassau.codeannotation.mapper.ModelMapper;
import com.ntd.unipassau.codeannotation.repository.ModelRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.ModelVM;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@Service
public class ModelService {
    private final ModelRepository modelRepository;
    private final ModelMapper modelMapper;

    public ModelService(
            ModelRepository modelRepository,
            ModelMapper modelMapper) {
        this.modelRepository = modelRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public Collection<ModelVM> listModels() {
        return modelRepository.findAll(Sort.by(Sort.Order.desc("lastModifiedDate"))).stream()
                .map(modelMapper::toModelVM)
                .toList();
    }

    @Transactional
    public ModelVM createModel(ModelVM modelVM) {
        Model model = modelMapper.toModel(modelVM);
        model = modelRepository.save(model);
        return modelMapper.toModelVM(model);
    }

    @Transactional
    public Optional<ModelVM> updateModel(Long modelId, ModelVM modelVM) {
        return modelRepository.findById(modelId)
                .map(model -> {
                    BeanUtils.copyProperties(modelVM, model, "id");
                    return modelMapper.toModelVM(model);
                });
    }

    @Transactional
    public Optional<ModelVM> deleteModel(Long modelId) {
        return modelRepository.findById(modelId)
                .map(model -> {
                    modelRepository.delete(model);
                    return modelMapper.toModelVM(model);
                });
    }
}
