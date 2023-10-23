package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.User;
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
    @JoinColumn(name = "user_id", unique = true, foreignKey = @ForeignKey(name = "fk_rater_user"))
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "rater", cascade = {CascadeType.REMOVE})
    @ToString.Exclude
    private Set<Solution> solutions;

    @OneToMany(mappedBy = "rater", cascade = {CascadeType.REMOVE})
    @ToString.Exclude
    private Set<SnippetRate> rates;
}
