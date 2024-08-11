package com.ntd.unipassau.codeannotation.export.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntd.unipassau.codeannotation.export.MetadataExporter;
import com.ntd.unipassau.codeannotation.export.model.DemographicQuestionDoc;
import com.ntd.unipassau.codeannotation.export.model.RaterActionDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import com.ntd.unipassau.codeannotation.export.model.SolutionDoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;
import java.util.Map;
import java.util.Set;

@Component
public class JsonMetadataExporter implements MetadataExporter {

    private final static String KEY_QUESTIONS = "questions";
    private final static String KEY_SOLUTIONS = "solutions";

    private final ObjectMapper objectMapper;

    @Autowired
    public JsonMetadataExporter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void exportSnippetMetadata(Path path, SnippetDoc snippet) throws IOException {
        objectMapper.writeValue(path.toFile(), snippet);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void exportDemographicSolutions(
            Path path,
            Set<DemographicQuestionDoc> questionDocs,
            Set<SolutionDoc> solutionDocs) throws IOException {
        Map<String, Set<?>> record = Map.of(KEY_QUESTIONS, questionDocs, KEY_SOLUTIONS, solutionDocs);
        objectMapper.writeValue(path.toFile(), record);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void exportRaterActions(Path path, Collection<RaterActionDoc> actions) throws IOException {
        objectMapper.writeValue(path.toFile(), actions);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SnippetDoc readSnippetMetadata(Path path) throws IOException {
        return objectMapper.readValue(path.toFile(), SnippetDoc.class);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getFilenameExtension() {
        return "json";
    }
}
