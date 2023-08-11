package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.client.RemoteFileReader;
import com.ntd.unipassau.codeannotation.client.impl.HttpFileReader;
import com.ntd.unipassau.codeannotation.domain.Question;
import com.ntd.unipassau.codeannotation.domain.RateAnswer;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.domain.SnippetRate;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.repository.AnswerRepository;
import com.ntd.unipassau.codeannotation.repository.RateAnswerRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRateRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SnippetService {
    final static String RAW_GITHUB_HOST = "raw.githubusercontent.com";
    private final AnswerRepository answerRepository;
    private final RateAnswerRepository rateAnswerRepository;
    private final SnippetRepository snippetRepository;
    private final SnippetRateRepository snippetRateRepository;
    private final SnippetMapper snippetMapper;
    private final QuestionService questionService;

    @Autowired
    public SnippetService(
            AnswerRepository answerRepository,
            RateAnswerRepository rateAnswerRepository,
            SnippetRepository snippetRepository,
            SnippetRateRepository snippetRateRepository,
            SnippetMapper snippetMapper,
            QuestionService questionService) {
        this.answerRepository = answerRepository;
        this.rateAnswerRepository = rateAnswerRepository;
        this.snippetRepository = snippetRepository;
        this.snippetRateRepository = snippetRateRepository;
        this.snippetMapper = snippetMapper;
        this.questionService = questionService;
    }

    public Collection<Snippet> getDatasetSnippets(Long datasetId) {
        return snippetRepository.findAllByDatasetId(datasetId);
    }

    public Optional<Snippet> getById(Long snippetId) {
        return snippetRepository.findById(snippetId);
    }

    @SneakyThrows
    @Transactional
    public Snippet createSnippet(Snippet snippet) {
        // Make sure bi-directional relation
        snippet.getQuestions()
                .forEach(question -> {
                    question.setSnippet(snippet);
                    question.getAnswers().forEach(answer -> answer.setQuestion(question));
                });
        String code = extractSnippetCode(snippet);
        snippet.setCode(code);
        return snippetRepository.save(snippet);
    }

    @Transactional
    public Collection<Snippet> createSnippetsInBatch(Collection<Snippet> snippets) {
        Collection<Question> questions = new LinkedHashSet<>();
        Collection<SnippetRate> rates = new LinkedHashSet<>();
        snippets.forEach(s -> {
            questions.addAll(s.getQuestions());
            if (s.getRate() != null) {
                rates.add(s.getRate());
            }
            s.setQuestions(null);
            s.setRate(null);
        });

        snippetRepository.saveAll(snippets);
        questionService.createAllInBatch(questions);
        createRatesInBatch(rates);

        return snippets;
    }

    @Transactional
    public Collection<SnippetRate> createRatesInBatch(Collection<SnippetRate> rates) {
        Collection<RateAnswer> rateAnswers = new LinkedHashSet<>();
        rates.forEach(r -> {
            r.getAnswers().forEach(ra -> ra.setId(ra.getAnswer().getId()));
            rateAnswers.addAll(r.getAnswers());
            r.setAnswers(null);
        });

        snippetRateRepository.saveAll(rates);
        rateAnswerRepository.saveAll(rateAnswers);

        return rates;
    }

    @Transactional
    public void deleteById(Long snippetId) {
        snippetRepository.deleteById(snippetId);
    }

    @Transactional
    public void deleteAllInBatch(Collection<Snippet> snippets) {
        Set<Question> questions = snippets.stream()
                .flatMap(s -> s.getQuestions().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        questionService.deleteAllInBatch(questions);

        Set<SnippetRate> rates = snippets.stream()
                .map(Snippet::getRate)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Set<RateAnswer> rateAnswers = rates.stream()
                .flatMap(r -> r.getAnswers().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        rateAnswerRepository.deleteAllInBatch(rateAnswers);
        snippetRateRepository.deleteAllInBatch(rates);

        snippetRepository.deleteAllInBatch(snippets);
    }

    @Transactional
    public void rateSnippet(SnippetRateVM rateVM, Snippet snippet) {
        SnippetRate rate = snippet.getRate();
        if (rate == null) {
            rate = snippetMapper.toSnippetRate(rateVM);
            rate.setSnippet(snippet);
        } else {
            BeanUtils.copyProperties(rateVM, rate);
        }

        // Delete old answers
        rateAnswerRepository.deleteAllBySnippet(snippet.getId());
        rate.setAnswers(new LinkedHashSet<>());

        // Add all of new rate answers
        final SnippetRate finalRate = rate;
        if (rateVM.getSelectedAnswers() != null) {
            answerRepository.findAllById(rateVM.getSelectedAnswers())
                    .forEach(answer -> {
                        RateAnswer rateAnswer = new RateAnswer();
                        rateAnswer.setId(answer.getId());
                        rateAnswer.setAnswer(answer);
                        rateAnswer.setRate(finalRate);
                        finalRate.getAnswers().add(rateAnswer);
                    });
        }

        snippetRateRepository.save(finalRate);
    }

    private String extractSnippetCode(Snippet snippet) throws IOException {
        // Replace "github.com" by "raw.githubusercontent.com" and remove "/blob" in path
        URI fileUri = UriComponentsBuilder.fromHttpUrl(snippet.getPath().replace("/blob", ""))
                .host(RAW_GITHUB_HOST)
                .build()
                .toUri();
        RemoteFileReader remoteFileReader = new HttpFileReader();
        Collection<String> lines = remoteFileReader.readFileLines(fileUri, snippet.getFromLine(), snippet.getToLine());
        return String.join("\n", lines);
    }
}
