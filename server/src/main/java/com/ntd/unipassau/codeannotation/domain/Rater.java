package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "rater")
@Setter
@Getter
@ToString
public class Rater extends AbstractAuditingEntity<UUID> {
    @Id
    private UUID id;
    private Integer yearOfExp;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", unique=true)
    @ToString.Exclude
    private User user;
}
