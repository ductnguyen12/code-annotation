package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.Rater;
import com.ntd.unipassau.codeannotation.mapper.RaterMapper;
import com.ntd.unipassau.codeannotation.service.RaterService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Rater Resource")
@RestController
public class RaterResource {
    private final RaterService raterService;
    private final RaterMapper raterMapper;

    @Autowired
    public RaterResource(
            RaterService raterService,
            RaterMapper raterMapper) {
        this.raterService = raterService;
        this.raterMapper = raterMapper;
    }

    @Operation(summary = "Register as a rater")
    @PostMapping("/v1/raters/registration")
    public RaterVM registerRater(@RequestBody @Valid RaterVM raterVM) {
        Rater rater = raterService.registerRater(raterVM);
        return raterMapper.toRaterVM(rater);
    }
}
