package com.ntd.unipassau.codeannotation.domain.question;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "question_question_set")
@Setter
@Getter
@ToString
public class QuestionGroupAssignment extends AbstractAuditingEntity<QuestionGroupAssignment.Id> {
    @EmbeddedId
    private Id id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "question_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_question_questionset"))
    @ToString.Exclude
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("groupId")
    @JoinColumn(name = "question_set_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_questionset_question"))
    @ToString.Exclude
    private QuestionSet group;

    private Integer priority = 0;

    public QuestionGroupAssignment() {
    }

    public QuestionGroupAssignment(Question question, QuestionSet group) {
        this.question = question;
        this.group = group;
        this.id = new Id(question.getId(), group.getId());
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy
                ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass()
                : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass()
                : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        QuestionGroupAssignment that = (QuestionGroupAssignment) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class Id implements Serializable {
        @Column(name = "question_id")
        private Long questionId;

        @Column(name = "question_set_id")
        private Long groupId;
    }
}
