package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.rater.Rater;
import com.ntd.unipassau.codeannotation.export.model.RateDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.MessageFormat;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class DefaultDatasetExporter implements DatasetExporter {
    private final static String DIR_DATASET_SNIPPETS = "dataset-{0}-snippets";
    private final static String SOURCE_CODE_FILENAME = "{0}_{1}";
    private final static String METADATA_FILENAME = "{0}.{1}";

    private final ExportModelMapper exportModelMapper;
    private final RaterRepository raterRepository;
    private final MetadataExporter metadataExporter;

    @Autowired
    public DefaultDatasetExporter(
            ExportModelMapper exportModelMapper,
            RaterRepository raterRepository,
            MetadataExporter metadataExporter) {
        this.exportModelMapper = exportModelMapper;
        this.raterRepository = raterRepository;
        this.metadataExporter = metadataExporter;
    }

    @Override
    public Resource exportSnippets(Dataset dataset) throws IOException {
        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        tmpDir.toFile().deleteOnExit();

        exportSnippets(tmpDir, dataset.getSnippets());

        Path outPath = Files.createTempFile(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()), ".zip");
        ZipUtil.zipDirectory(tmpDir, outPath);

        return new UrlResource(outPath.toUri());
    }

    @Override
    public void exportSnippets(Path dir, Collection<Snippet> snippets) throws IOException {
        for (Snippet snippet : snippets) {
            // Add prefix id to make filename unique.
            // Also remove domain part and replace slashes by dot to get source code filename
            String sourceCodeFilename = MessageFormat.format(
                    SOURCE_CODE_FILENAME, snippet.getId(), ExportFileUtil.getFilenameFromPath(snippet.getPath()));
            Path sourceCodePath = dir.resolve(sourceCodeFilename);
            Files.writeString(sourceCodePath, snippet.getCode(), StandardCharsets.UTF_8);

            // Add extension .json to get metadata filename
            String metadataFilename = MessageFormat.format(
                    METADATA_FILENAME, sourceCodeFilename, metadataExporter.getFilenameExtension());
            Path metadataPath = dir.resolve(metadataFilename);
            SnippetDoc snippetDoc = exportModelMapper.toSnippetDoc(snippet);
            metadataExporter.exportSnippetMetadata(metadataPath, snippetDoc);
        }
    }

    @Override
    public Dataset importSnippets(Dataset dataset, Resource resource) throws IOException {
        Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        ZipUtil.unzip(resource.getInputStream(), tmpDir);

        Collection<File> sourceFiles = new ArrayList<>();
        Collection<File> metadataFiles = new ArrayList<>();
        // Use this one to ignore source files that were already imported from metadata files!
        Set<String> metadataBaseFilenames = new LinkedHashSet<>();
        try (Stream<Path> pathStream = Files.walk(tmpDir)) {
            pathStream.map(Path::toFile)
                    .filter(File::isFile)
                    .forEach(file -> {
                        if (file.getName().endsWith(metadataExporter.getFilenameExtension())) {
                            metadataFiles.add(file);
                            metadataBaseFilenames.add(ExportFileUtil.getBaseFilename(file.getName()));
                        } else {
                            sourceFiles.add(file);
                        }
                    });
        }

        Set<Snippet> snippets = importFromMetadataFiles(metadataFiles, dataset);
        Set<Snippet> nonMetadataSnippets = importFromSourceCodeFiles(
                sourceFiles,
                file -> !metadataBaseFilenames.contains(file.getName()),
                dataset);
        snippets.addAll(nonMetadataSnippets);
        dataset.setSnippets(snippets);
        return dataset;
    }

    private Set<Snippet> importFromMetadataFiles(Collection<File> metadataFiles, Dataset dataset) {
        // Use set of all raters id to validate rater info from request
        Set<UUID> allRaters = raterRepository.findAll().stream().map(Rater::getId).collect(Collectors.toSet());
        return metadataFiles.stream()
                .map(file -> {
                    // Parse metadata
                    SnippetDoc snippetDoc = null;
                    try {
                        snippetDoc = metadataExporter.readSnippetMetadata(file.toPath());

                        if (!CollectionUtils.isEmpty(snippetDoc.getRates())) {
                            // Filter out not existed rater
                            List<RateDoc> rates = snippetDoc.getRates().stream()
                                    .filter(r -> allRaters.contains(UUID.fromString(r.getRater())))
                                    .collect(Collectors.toList());
                            snippetDoc.setRates(rates);
                        }

                        Path sourceCodePath = file.toPath().getParent()
                                .resolve(ExportFileUtil.getBaseFilename(file.getName()));

                        if (!Files.exists(sourceCodePath))
                            return null;

                        // Read source code file
                        String code = Files.readString(sourceCodePath);

                        Snippet snippet = exportModelMapper.toSnippet(snippetDoc);
                        snippet.setCode(code);
                        snippet.setDataset(dataset);
                        return snippet;
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private Set<Snippet> importFromSourceCodeFiles(
            Collection<File> sourceFiles, Predicate<File> ignoreCondition, Dataset dataset) {
        return sourceFiles.stream()
                .filter(ignoreCondition)
                .map(file -> {
                    try {
                        // Read source code file
                        String code = Files.readString(file.toPath());
                        Snippet snippet = new Snippet();
                        snippet.setPath(file.getName());
                        snippet.setFromLine(1);
                        snippet.setToLine(code.split("\n").length + 1);
                        snippet.setCode(code);
                        snippet.setDataset(dataset);
                        return snippet;
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toSet());
    }
}
