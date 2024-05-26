package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Calendar;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @OneToMany(mappedBy = "rater", cascade = {CascadeType.ALL}, orphanRemoval = true)
    @ToString.Exclude
    private Set<RaterDataset> raterDatasets;

    public void addDataset(Dataset dataset) {
        if (dataset == null)
            return;
        if (raterDatasets == null) {
            raterDatasets = new LinkedHashSet<>();
        }
        RaterDataset raterDataset = new RaterDataset(this, dataset);
        raterDataset.setStatus(SubmissionStatus.ACTIVE);
        raterDataset.setStartedAt(Calendar.getInstance().getTime());
        raterDatasets.add(raterDataset);
    }

    public Set<Dataset> getDatasets() {
        return raterDatasets.stream()
                .map(RaterDataset::getDataset)
                .collect(Collectors.toSet());
    }
}
