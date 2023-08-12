package com.ntd.unipassau.codeannotation.export.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntd.unipassau.codeannotation.export.MetadataExporter;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;

@Component
public class JsonMetadataExporter implements MetadataExporter {
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
