package com.ntd.unipassau.codeannotation.domain.rquestion;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "rater_question")
@Setter
@Getter
@ToString
public class RQuestion extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rater_question_seq")
    @SequenceGenerator(name = "rater_question_seq", allocationSize = 1)
    private Long id;
    private String content;
    @Enumerated(EnumType.STRING)
    private RQuestionType type;
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private RAnswerConstraint answerConstraint;
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private RAnswer answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_set_id", foreignKey = @ForeignKey(name = "fk_rquestion_rquestionset"))
    @ToString.Exclude
    private RQuestionSet questionSet;
}
