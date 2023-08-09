package com.ntd.unipassau.codeannotation.export.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntd.unipassau.codeannotation.domain.Dataset;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.export.DatasetExporter;
import com.ntd.unipassau.codeannotation.export.ExportFileUtil;
import com.ntd.unipassau.codeannotation.export.ExportModelMapper;
import com.ntd.unipassau.codeannotation.export.ZipUtil;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.MessageFormat;
import java.util.Collection;

@Component
@Slf4j
public class JsonDatasetExporter implements DatasetExporter {
    private final static String DIR_DATASET_SNIPPETS = "dataset-{0}-snippets";
    private final static String METADATA_FILENAME = "{0}.json";
    private final ObjectMapper objectMapper;
    private final ExportModelMapper exportModelMapper;

    @Autowired
    public JsonDatasetExporter(ObjectMapper objectMapper, ExportModelMapper exportModelMapper) {
        this.objectMapper = objectMapper;
        this.exportModelMapper = exportModelMapper;
    }

    @Override
    public Resource exportSnippets(Dataset dataset) throws IOException {
        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        tmpDir.toFile().deleteOnExit();

        saveSnippets(tmpDir, dataset.getSnippets());

        Path outPath = Files.createTempFile(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()), ".zip");
        ZipUtil.zipDirectory(tmpDir, outPath);

        return new UrlResource(outPath.toUri());
    }

    private void saveSnippets(Path dir, Collection<Snippet> snippets) throws IOException {
        for (Snippet snippet : snippets) {
            // Add prefix id to make filename unique.
            // Also remove domain part and replace slashes by dot to get source code filename
            String sourceCodeFilename =
                    snippet.getId() + "_" + ExportFileUtil.getFilenameFromHttpPath(snippet.getPath());
            Path sourceCodePath = dir.resolve(sourceCodeFilename);
            Files.writeString(sourceCodePath, snippet.getCode(), StandardCharsets.UTF_8);

            // Add extension .json to get metadata filename
            String metadataFilename = MessageFormat.format(METADATA_FILENAME, sourceCodeFilename);
            Path metadataPath = dir.resolve(metadataFilename);
            SnippetDoc snippetDoc = exportModelMapper.toSnippetDoc(snippet);
            objectMapper.writeValue(metadataPath.toFile(), snippetDoc);
        }
    }
}
