package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.dataset.SnippetQuestion;
import com.ntd.unipassau.codeannotation.repository.SnippetQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class SnippetQuestionService {
    private final SnippetQuestionRepository snippetQuestionRepository;

    public SnippetQuestionService(
            SnippetQuestionRepository snippetQuestionRepository) {
        this.snippetQuestionRepository = snippetQuestionRepository;
    }

    @Transactional
    public Collection<SnippetQuestion> createAllInBatch(Collection<SnippetQuestion> questions) {
        snippetQuestionRepository.saveAll(questions);
        return questions;
    }

    @Transactional
    public void deleteAllInBatch(Collection<SnippetQuestion> questions) {
        snippetQuestionRepository.deleteAllInBatch(questions);
    }
}
