package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "rate_answer")
@Getter
@Setter
@ToString
public class RateAnswer {
    @Id
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @PrimaryKeyJoinColumn(name = "id")
    @ToString.Exclude
    private Answer answer;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "rate_id", nullable = false)
    @ToString.Exclude
    private SnippetRate rate;
}
