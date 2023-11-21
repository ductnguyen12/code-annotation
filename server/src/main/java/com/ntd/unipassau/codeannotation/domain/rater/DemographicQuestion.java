package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "demographic_question")
@DiscriminatorValue("demographic")
@Setter
@Getter
@ToString
public class DemographicQuestion extends Question {
}
