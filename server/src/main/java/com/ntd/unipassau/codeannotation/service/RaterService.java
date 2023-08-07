package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.Rater;
import com.ntd.unipassau.codeannotation.mapper.RaterMapper;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.repository.UserRepository;
import com.ntd.unipassau.codeannotation.security.SecurityUtils;
import com.ntd.unipassau.codeannotation.security.UserPrincipal;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class RaterService {
    private final UserRepository userRepository;
    private final RaterRepository raterRepository;
    private final RaterMapper raterMapper;

    @Autowired
    public RaterService(
            UserRepository userRepository,
            RaterRepository raterRepository,
            RaterMapper raterMapper) {
        this.userRepository = userRepository;
        this.raterRepository = raterRepository;
        this.raterMapper = raterMapper;
    }

    @Transactional
    public Rater registerRater(RaterVM raterVM) {
        Rater rater = raterMapper.toRater(raterVM);
        rater.setId(UUID.randomUUID());
        SecurityUtils.getCurrentUser()
                .flatMap(userDetails -> userRepository.findByUsername(userDetails.getUsername()))
                .ifPresent(user -> {
                    rater.setId(UUID.randomUUID());
                    rater.setUser(user);
                });
        return raterRepository.save(rater);
    }

    /**
     * Get rater's information of current user
     * @return {@link Optional<Rater>} information of current user
     */
    public Optional<Rater> getCurrentRater() {
        return SecurityUtils.getCurrentUser()
                .filter(UserPrincipal.class::isInstance)
                .map(UserPrincipal.class::cast)
                .flatMap(user -> raterRepository.findById(user.getId()));
    }
}
