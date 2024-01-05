package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.client.RemoteFileReader;
import com.ntd.unipassau.codeannotation.client.impl.HttpFileReader;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import com.ntd.unipassau.codeannotation.mapper.SnippetMapper;
import com.ntd.unipassau.codeannotation.repository.PredictedRatingRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRateRepository;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.repository.SolutionRepository;
import com.ntd.unipassau.codeannotation.security.SecurityUtils;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetRateVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SnippetService {
    final static String RAW_GITHUB_HOST = "raw.githubusercontent.com";
    private final SnippetRepository snippetRepository;
    private final SnippetRateRepository snippetRateRepository;
    private final PredictedRatingRepository pRatingRepository;
    private final SnippetMapper snippetMapper;
    private final SnippetQuestionService snippetQuestionService;
    private final SolutionService solutionService;
    private final RaterService raterService;
    private final SolutionRepository solutionRepository;

    @Autowired
    public SnippetService(
            SnippetRepository snippetRepository,
            SnippetRateRepository snippetRateRepository,
            PredictedRatingRepository pRatingRepository,
            SnippetMapper snippetMapper,
            SnippetQuestionService snippetQuestionService,
            SolutionService solutionService,
            RaterService raterService,
            SolutionRepository solutionRepository) {
        this.snippetRepository = snippetRepository;
        this.snippetRateRepository = snippetRateRepository;
        this.pRatingRepository = pRatingRepository;
        this.solutionService = solutionService;
        this.snippetMapper = snippetMapper;
        this.snippetQuestionService = snippetQuestionService;
        this.raterService = raterService;
        this.solutionRepository = solutionRepository;
    }

    @Transactional(readOnly = true)
    public Collection<SnippetVM> getDatasetSnippets(Long datasetId) {
        Collection<Snippet> snippets = snippetRepository.findAllByDatasetId(datasetId);
        Collection<SnippetVM> snippetVMs = snippetMapper.toSnippetVMs(snippets);

        // Admin can retrieve all rates and solutions
        if (SecurityUtils.isAuthenticated())
            return snippetVMs;

        // Filter rates and solutions for current rater
        raterService.getCurrentRater()
                .ifPresent(rater -> snippetVMs.forEach(s -> {
                    if (!CollectionUtils.isEmpty(s.getRates())) {
                        s.setRates(s.getRates().stream()
                                .filter(r -> rater.getId().equals(r.getRater().getId()))
                                .collect(Collectors.toList()));
                    }
                    if (!CollectionUtils.isEmpty(s.getQuestions())) {
                        s.getQuestions().forEach(q -> {
                            if (!CollectionUtils.isEmpty(q.getSolutions())) {
                                q.setSolutions(q.getSolutions().stream()
                                        .filter(sl -> rater.getId().equals(sl.raterId()))
                                        .collect(Collectors.toList()));
                            }
                        });
                    }
                }));

        return snippetVMs;
    }

    public Optional<Snippet> getById(Long snippetId) {
        return snippetRepository.findFetchQuestionsById(snippetId);
    }

    @SneakyThrows
    @Transactional
    public Snippet createSnippet(Snippet snippet) {
        if (snippet.getQuestions() != null) {
            // Make sure bi-directional relation
            snippet.getQuestions()
                    .forEach(question -> {
                        question.setSnippet(snippet);
                    });
        }
        String code = extractSnippetCode(snippet);
        snippet.setCode(code);
        return snippetRepository.save(snippet);
    }

    @Transactional
    public Collection<Snippet> createSnippetsInBatch(Collection<Snippet> snippets) {
        Collection<SnippetQuestion> questions = new LinkedHashSet<>();
        Collection<SnippetRate> rates = new LinkedHashSet<>();

        // Separate rates and snipets in order to avoid saving one by one
        snippets.forEach(s -> {
            if (CollectionUtils.isEmpty(s.getQuestions()))
                return;
            questions.addAll(s.getQuestions());
            if (!CollectionUtils.isEmpty(s.getRates())) {
                rates.addAll(s.getRates());
            }
            s.setQuestions(null);
            s.setRates(new LinkedHashSet<>());
        });

        // Save all in batch
        snippetRepository.saveAll(snippets);
        snippetQuestionService.createAllInBatch(questions);
        createRatesInBatch(rates);

        return snippets;
    }

    @Transactional
    public Collection<SnippetRate> createRatesInBatch(Collection<SnippetRate> rates) {
        return snippetRateRepository.saveAll(rates);
    }

    @Transactional
    public void deleteById(Long snippetId) {
        snippetRepository.deleteById(snippetId);
    }

    @Transactional
    public void deleteAllInBatch(Collection<Snippet> snippets) {
        Set<SnippetQuestion> questions = snippets.stream()
                .flatMap(s -> s.getQuestions().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Set<Solution> solutions = questions.stream().map(Question::getSolutions)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        solutionRepository.deleteAllInBatch(solutions);
        snippetQuestionService.deleteAllInBatch(questions);

        Set<SnippetRate> rates = snippets.stream()
                .map(Snippet::getRates)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        snippetRateRepository.deleteAllInBatch(rates);

        pRatingRepository.deleteAllBySnippets(snippets.stream().map(Snippet::getId).toList());

        snippetRepository.deleteAllInBatch(snippets);
    }

    @Transactional
    public void rateSnippet(SnippetRateVM rateVM, Snippet snippet) {
        saveSnippetRate(rateVM, snippet);
        solutionService.createSnippetSolutionsInBatch(
                snippet.getId(),
                raterService.getCurrentRater()
                        .orElseThrow(() -> new RuntimeException("Saving Solution requires rater")),
                rateVM.getSolutions()
        );
    }

    private void saveSnippetRate(SnippetRateVM rateVM, Snippet snippet) {
        Rater rater = raterService.getCurrentRater()
                .orElseThrow(() -> new RuntimeException("Saving SnippetRate requires rater"));
        SnippetRate rate = snippetRateRepository.findBySnippetAndRater(snippet.getId(), rater.getId())
                .orElse(null);

        if (rate == null) {
            rate = snippetMapper.toSnippetRate(rateVM);
        } else {
            BeanUtils.copyProperties(rateVM, rate);
        }
        rate.setSnippet(snippet);
        rate.setRater(rater);

        snippetRateRepository.save(rate);
    }

    private String extractSnippetCode(Snippet snippet) throws IOException {
        // Replace "github.com" by "raw.githubusercontent.com" and remove "/blob" in
        // path
        URI fileUri = UriComponentsBuilder.fromHttpUrl(snippet.getPath().replace("/blob", ""))
                .host(RAW_GITHUB_HOST)
                .build()
                .toUri();
        RemoteFileReader remoteFileReader = new HttpFileReader();
        Collection<String> lines = remoteFileReader.readFileLines(fileUri, snippet.getFromLine(), snippet.getToLine());
        return String.join("\n", lines);
    }
}
