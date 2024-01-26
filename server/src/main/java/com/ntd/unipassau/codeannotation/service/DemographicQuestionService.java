package com.ntd.unipassau.codeannotation.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestionGroup;
import com.ntd.unipassau.codeannotation.mapper.DemographicQuestionMapper;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionGroupRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.repository.SolutionRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.DQuestionParams;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.IntStream;

@Service
public class DemographicQuestionService {
    private final SnippetRepository snippetRepository;
    private final DemographicQuestionRepository dQuestionRepository;
    private final DemographicQuestionGroupRepository dqgRepository;
    private final SolutionRepository solutionRepository;
    private final SnippetMapper snippetMapper;
    private final DemographicQuestionMapper dQuestionMapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public DemographicQuestionService(
            SnippetRepository snippetRepository,
            DemographicQuestionRepository dQuestionRepository,
            DemographicQuestionGroupRepository dqgRepository,
            SolutionRepository solutionRepository,
            SnippetMapper snippetMapper,
            DemographicQuestionMapper dQuestionMapper,
            ObjectMapper objectMapper) {
        this.snippetMapper = snippetMapper;
        this.objectMapper = objectMapper;
        this.snippetRepository = snippetRepository;
        this.dQuestionRepository = dQuestionRepository;
        this.dQuestionMapper = dQuestionMapper;
        this.dqgRepository = dqgRepository;
        this.solutionRepository = solutionRepository;
    }

    @Transactional
    @SneakyThrows
    public DemographicQuestionVM createDemographicQuestion(DemographicQuestionVM questionVM) {
        DemographicQuestion question = dQuestionMapper.toQuestion(questionVM);

        if (questionVM.getType() == QuestionType.SNIPPET) {
            Answer answer = new Answer();
            answer.setOptions(IntStream.range(0, 6).mapToObj(Integer::toString).toList());
            question.setAnswer(answer);

            SnippetVM snippetVM = objectMapper.readValue(questionVM.getContent(), SnippetVM.class);
            enrichSnippetContent(question, snippetVM.getId());
        }

        enrichQuestionGroups(question, questionVM);

        dQuestionRepository.save(question);
        return dQuestionMapper.toQuestionVM(question);
    }

    @Transactional
    @SneakyThrows
    public DemographicQuestionVM updateDemographicQuestion(Long questionId, DemographicQuestionVM questionVM) {
        DemographicQuestion question = dQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Could not find rater-question by id: " + questionId));
        if (questionVM.getType() == QuestionType.SNIPPET) {
            Answer answer = new Answer();
            answer.setOptions(IntStream.range(0, 6).mapToObj(Integer::toString).toList());
            question.setAnswer(answer);

            SnippetVM currentSnippet = objectMapper.readValue(question.getContent(), SnippetVM.class);
            SnippetVM snippetVM = objectMapper.readValue(questionVM.getContent(), SnippetVM.class);
            if (!currentSnippet.getId().equals(snippetVM.getId())) {
                solutionRepository.deleteDemographicSolutionsByQuestionsId(
                        question.getSubQuestions().stream().map(Question::getId).toList());
                dQuestionRepository.deleteAllInBatch(question.getSubQuestions());

                enrichSnippetContent(question, snippetVM.getId());

                BeanUtils.copyProperties(questionVM, question,
                        "id", "content", "subQuestions", "answer");
            }
        } else {
            BeanUtils.copyProperties(questionVM, question, "id");
        }

        enrichQuestionGroups(question, questionVM);

        dQuestionRepository.save(question);
        return dQuestionMapper.toQuestionVM(question);
    }

    @Transactional(readOnly = true)
    public Collection<DemographicQuestionVM> listDemographicQuestions(DQuestionParams params) {
        return dQuestionMapper.toQuestionVMs(dQuestionRepository.findAllFetchGroup(params.getDatasetId()));
    }

    private void enrichQuestionGroups(DemographicQuestion question, DemographicQuestionVM questionVM) {
        if (questionVM.getQuestionSetIds() != null) {
            Set<DemographicQuestionGroup> groups =
                    dqgRepository.findAllFetchQuestionsByIds(questionVM.getQuestionSetIds());
            groups.forEach(group -> group.getQuestions().add(question));
            question.setQuestionSets(new LinkedHashSet<>(groups));
        }
    }

    private void enrichSnippetContent(DemographicQuestion question, Long snippetId) {
        Snippet snippet = snippetRepository.findFetchQuestionsById(snippetId)
                .orElseThrow(() -> new RuntimeException("Could not find snippet by id: " + snippetId));
        Dataset dataset = snippet.getDataset();
        SnippetVM simpleSnippet = snippetMapper.toSimpleSnippetVM(snippet);
        simpleSnippet.setPLanguage(dataset.getPLanguage());
        try {
            String content = objectMapper.writeValueAsString(simpleSnippet);
            question.setContent(content);
            snippet.getQuestions().forEach(sQuestion -> {
                DemographicQuestion subQuestion = new DemographicQuestion();
                BeanUtils.copyProperties(sQuestion, subQuestion, "id", "questionSets", "solutions");
                question.addSubQuestion(subQuestion);
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
