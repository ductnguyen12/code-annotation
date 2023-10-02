package com.ntd.unipassau.codeannotation.domain;

import com.ntd.unipassau.codeannotation.domain.rquestion.RSolution;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "rater")
@Setter
@Getter
@ToString
public class Rater extends AbstractAuditingEntity<UUID> {
    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "rater", cascade = {CascadeType.REMOVE})
    @ToString.Exclude
    private Set<RSolution> solutions;
}
