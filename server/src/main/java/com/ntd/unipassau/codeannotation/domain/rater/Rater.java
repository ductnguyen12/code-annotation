package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "rater",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_rater_external_system", columnNames = {"externalId", "externalSystem"}),
        }
)
@Setter
@Getter
@ToString
public class Rater extends AbstractAuditingEntity<UUID> {
    @Id
    private UUID id;

    private String externalId;
    private String externalSystem;

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

    @ManyToMany
    @JoinTable(name = "rater_dataset",
            joinColumns =
            @JoinColumn(name = "rater_id", referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_dataset_rater")),
            inverseJoinColumns =
            @JoinColumn(name = "dataset_id", referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_rater_dataset"))
    )
    @ToString.Exclude
    private Set<Dataset> datasets;
}
