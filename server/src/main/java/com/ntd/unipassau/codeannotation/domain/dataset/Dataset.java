package com.ntd.unipassau.codeannotation.domain.dataset;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.domain.rater.RaterDataset;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "dataset")
@Setter
@Getter
@ToString
public class Dataset extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dataset_seq")
    @SequenceGenerator(name = "dataset_seq", allocationSize = 1)
    private Long id;

    private String name;

    @Column(length = 2048)
    private String description;

    private String pLanguage;

    @Column(length = 2048)
    private String completeText;

    private Boolean archived;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Map<String, Object>> configuration;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "dataset")
    @ToString.Exclude
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Set<Snippet> snippets;

    @ManyToMany(mappedBy = "datasets", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private Set<DemographicQuestionGroup> dQuestionGroups;

    @OneToMany(mappedBy = "dataset", orphanRemoval = true)
    @ToString.Exclude
    private Set<RaterDataset> raterDatasets;

    public boolean isArchived() {
        return Boolean.TRUE.equals(archived);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dataset dataset = (Dataset) o;
        return Objects.equals(id, dataset.id);
    }
}
