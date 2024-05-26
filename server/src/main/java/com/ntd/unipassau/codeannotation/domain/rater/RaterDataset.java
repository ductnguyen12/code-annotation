package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "rater_dataset")
@Setter
@Getter
@ToString
@NoArgsConstructor
public class RaterDataset extends AbstractAuditingEntity<RaterDataset.RaterDatasetId> {
    @Id
    private RaterDatasetId id;
    private Date startedAt;
    private Date completedAt;
    private String status;

    @MapsId("raterId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Rater rater;

    @MapsId("datasetId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Dataset dataset;

    public RaterDataset(Rater rater, Dataset dataset) {
        id = new RaterDatasetId();
        id.setRaterId(rater.getId());
        id.setDatasetId(dataset.getId());
        this.rater = rater;
        this.dataset = dataset;
    }

    @Embeddable
    @Data
    public static class RaterDatasetId implements Serializable {
        private UUID raterId;
        private Long datasetId;
    }
}
