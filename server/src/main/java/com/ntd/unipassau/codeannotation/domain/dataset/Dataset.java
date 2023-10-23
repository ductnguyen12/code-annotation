package com.ntd.unipassau.codeannotation.domain.dataset;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private String description;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "dataset")
    @ToString.Exclude
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Set<Snippet> snippets;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dataset dataset = (Dataset) o;
        return Objects.equals(id, dataset.id);
    }
}
