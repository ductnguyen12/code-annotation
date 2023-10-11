package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.mapper.RaterMapper;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.repository.UserRepository;
import com.ntd.unipassau.codeannotation.security.SecurityUtils;
import com.ntd.unipassau.codeannotation.security.UserPrincipal;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
public class RaterService {
    private final UserRepository userRepository;
    private final RaterRepository raterRepository;
    private final RaterMapper raterMapper;
    private final SolutionService solutionService;

    @Autowired
    public RaterService(
            UserRepository userRepository,
            RaterRepository raterRepository,
            RaterMapper raterMapper,
            SolutionService solutionService) {
        this.userRepository = userRepository;
        this.raterRepository = raterRepository;
        this.raterMapper = raterMapper;
        this.solutionService = solutionService;
    }

    @Transactional
    public RaterVM registerRater(RaterVM raterVM) {
        Rater savedRater = raterRepository.saveAndFlush(
                SecurityUtils.getCurrentUser()
                        .flatMap(userDetails -> userRepository.findByUsername(userDetails.getUsername()))
                        .map(user -> {
                            Rater rater = raterRepository.findByUserId(user.getId())
                                    .orElse(raterMapper.toRater(raterVM));
                            if (rater.getId() == null)
                                rater.setId(user.getId());
                            BeanUtils.copyProperties(raterVM, rater, "id");
                            rater.setUser(user);
                            return rater;
                        })
                        .orElseGet(() -> {
                            Rater rater = raterMapper.toRater(raterVM);
                            rater.setId(UUID.randomUUID());
                            return rater;
                        })
        );

        solutionService.createRaterSolutionsInBatch(savedRater, raterVM.solutions());
        Collection<SolutionVM> solutions = solutionService.getSolutionsByRater(savedRater.getId());

        return new RaterVM(savedRater.getId(), solutions);
    }

    public Collection<RaterVM> listRaters() {
        Collection<Rater> raters = raterRepository.findAllFetchSolutions();
        return raterMapper.toRaterVMs(raters);
    }

    public Optional<RaterVM> getRater(UUID raterId) {
        return raterRepository.findByIdFetchSolutions(raterId)
                .map(raterMapper::toRaterVM);
    }

    public void deleteRater(UUID raterId) {
        raterRepository.deleteById(raterId);
    }

    /**
     * Get rater's information of current user
     *
     * @return {@link Optional<Rater>} information of current user
     */
    @Transactional
    public Optional<Rater> getCurrentRater() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .map(principal -> {
                    if (principal instanceof UserPrincipal userPrincipal
                            && userPrincipal.getRaterId() != null) {
                        // Prefer user-linked rater to in-request rater information
                        return raterRepository.findByUserId(userPrincipal.getId())
                                .or(() -> raterRepository.findById(userPrincipal.getRaterId())
                                        .map(r -> {
                                            // Link user and rater
                                            userRepository.findById(userPrincipal.getId())
                                                    .ifPresent(r::setUser);
                                            return raterRepository.save(r);
                                        }))
                                .orElse(null);
                    } else if (principal instanceof String raterId) {
                        return raterRepository.findById(UUID.fromString(raterId))
                                .orElse(null);
                    }
                    return null;
                });
    }
}
